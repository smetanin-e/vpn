import { logger } from '@/src/shared/lib/logger';
import { ClientChargeResult, processClientCharge } from '../helpers/process-client-charge';
import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { ChargeError } from '../lib/charge-errors';

type DailyChargeResponse = {
  total: number;
  successful: number;
  failed: number;
  details: ClientChargeResult[];
  duration: number;
};
export async function dailyCharge(): Promise<DailyChargeResponse> {
  const startTime = Date.now();
  logger.info('[DAILY_CHARGE] Starting daily charge process');

  try {
    // Получаем всех активных клиентов
    const clients = await clientRepository.findClientsForPayment();
    logger.info(`[DAILY_CHARGE] Found ${clients.length} clients to process`);

    if (clients.length === 0) {
      return {
        total: 0,
        successful: 0,
        failed: 0,
        details: [],
        duration: Date.now() - startTime,
      };
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
    throw new ChargeError(
      `Daily charge process failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
