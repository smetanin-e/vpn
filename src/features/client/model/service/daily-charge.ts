import { logger } from '@/src/shared/lib/logger';
import { ClientChargeResult, processClientCharge } from '../helpers/process-client-charge';
import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { ChargeError } from '../lib/charge-errors';
import { prisma } from '@/src/shared/lib/prisma';
import { ChargeStatus } from '@/generated/prisma/enums';
import { createDailyChargeLog } from '../helpers/create-daily-charge-log';

type DailyChargeResponse = {
  total: number;
  successful: number;
  failed: number;
  details: ClientChargeResult[];
  duration: number;
};
export async function dailyCharge(): Promise<DailyChargeResponse> {
  const startTime = Date.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  logger.info('[DAILY_CHARGE] Starting daily charge process');

  try {
    // Проверяем, не было ли уже списания сегодня
    const existingLog = await prisma.dailyChargeLog.findUnique({
      where: { date: today },
    });

    if (existingLog && existingLog.status === ChargeStatus.COMPLETED) {
      logger.warn("[DAILY_CHARGE] Today's charge already completed", { date: today });
      return {
        total: existingLog.totalClients,
        successful: existingLog.successfulCount,
        failed: existingLog.failedCount,
        details: (existingLog.failedDetails as ClientChargeResult[]) || [],
        duration: existingLog.duration || 0,
      };
    }

    // Получаем всех активных клиентов
    const clients = await clientRepository.findClientsForPayment();
    logger.info(`[DAILY_CHARGE] Found ${clients.length} clients to process`);

    if (clients.length === 0) {
      const emptyResult = {
        total: 0,
        successful: 0,
        failed: 0,
        details: [],
        duration: Date.now() - startTime,
      };

      // Создаем лог с нулями
      await createDailyChargeLog(today, emptyResult, []);
      return emptyResult;
    }

    // Обрабатываем клиентов параллельно
    const results = await Promise.all(
      clients.map(async (client) => {
        try {
          return await processClientCharge(client);
        } catch (error) {
          logger.error(`[DAILY_CHARGE] Failed to process client ${client.id}`, error);
          return {
            success: false,
            clientId: client.id,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          } as ClientChargeResult;
        }
      }),
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const duration = Date.now() - startTime;

    const totalAmount = results.reduce((sum, r) => {
      if (r.success && r.newBalance !== undefined) {
        const oldBalance = clients.find((c) => c.id === r.clientId)?.balance || 0;
        return sum + (oldBalance - r.newBalance);
      }
      return sum;
    }, 0);

    // Создаем лог списания
    await createDailyChargeLog(
      today,
      {
        total: clients.length,
        successful,
        failed,
        details: results,
        duration,
      },
      results,
      totalAmount,
    );

    logger.info(
      `[DAILY_CHARGE] Completed in ${duration}ms. ` +
        `Total: ${clients.length}, Successful: ${successful}, Failed: ${failed}`,
    );

    // Логируем детали неудачных списаний
    if (failed > 0) {
      const failedDetails = results.filter((r) => !r.success);
      logger.warn('[DAILY_CHARGE] Failed charges:', failedDetails);
    }

    return {
      total: clients.length,
      successful,
      failed,
      details: results,
      duration,
    };
  } catch (error) {
    logger.error('[DAILY_CHARGE] Global error', error);
    // Логируем ошибку
    await createDailyChargeLog(
      today,
      {
        total: 0,
        successful: 0,
        failed: 0,
        details: [],
        duration: Date.now() - startTime,
      },
      [],
      0,
      error instanceof Error ? error.message : 'Unknown error',
    );

    throw new ChargeError(
      `Daily charge process failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
