import { logger } from '@/src/shared/lib/logger';
import { processClientChargeWithLog } from '../../../client/model/helpers/process-client-charge';
import { clientRepository } from '@/src/entities/client/repository/client.repository';

import { prisma } from '@/src/shared/lib/prisma';
import { ChargeLogInput } from '@/src/entities/daily-charge-logs/model/types.type';

export async function dailyCharge(): Promise<ChargeLogInput> {
  const startTime = Date.now();
  const today = new Date();
  today.setHours(3, 0, 0, 0);

  const chargeLogInput: ChargeLogInput = {
    totalClients: 0,
    successfulCount: 0,
    failedCount: 0,
    totalAmount: 0,
    disabledPeers: [],
    failedDetails: [],
  };

  try {
    const clients = await clientRepository.findClientsForPayment();
    chargeLogInput.totalClients = clients.length;

    logger.info(`[DAILY_CHARGE] Starting charge for ${clients.length} clients`);

    // Обрабатываем клиентов
    const results = await Promise.all(
      clients.map(async (client) => {
        try {
          return await processClientChargeWithLog(client);
        } catch (error) {
          return {
            success: false as const, // as const фиксирует тип как false, а не просто boolean
            clientId: client.id,
            disabled: false as const,
            error: error instanceof Error ? error.message : 'Unknown error',
            step: 'api_call' as const,
          };
        }
      }),
    );

    for (const result of results) {
      if (result.success) {
        chargeLogInput.successfulCount++;
        chargeLogInput.totalAmount += result.amount || 0;

        if (result.disabled) {
          chargeLogInput.disabledPeers.push({
            clientId: result.clientId,
            peerId: result.peerId,
            reason: result.disabledReason || 'Отрицательный баланс',
            newBalance: result.newBalance,
          });
        }
      } else {
        chargeLogInput.failedCount++;
        chargeLogInput.failedDetails.push({
          clientId: result.clientId,
          error: result.error || 'Unknown error',
          step: result.step || 'api_call',
        });
      }
    }

    const duration = Date.now() - startTime;
    logger.info(`[DAILY_CHARGE] Completed in ${duration}ms`, {
      total: chargeLogInput.totalClients,
      successful: chargeLogInput.successfulCount,
      failed: chargeLogInput.failedCount,
      totalAmount: chargeLogInput.totalAmount,
    });

    // Создаем запись в логе (только после успешного выполнения)
    await prisma.dailyChargeLog.create({
      data: {
        date: today,
        status: 'COMPLETED',
        totalClients: chargeLogInput.totalClients,
        successfulCount: chargeLogInput.successfulCount,
        failedCount: chargeLogInput.failedCount,
        totalAmount: chargeLogInput.totalAmount,
        disabledPeers: chargeLogInput.disabledPeers,
        failedDetails: chargeLogInput.failedDetails,
      },
    });

    return chargeLogInput;
  } catch (error) {
    // Логируем ошибку и создаем запись с FAILED
    logger.error('[DAILY_CHARGE] Global error', error);

    await prisma.dailyChargeLog.create({
      data: {
        date: today,
        status: 'FAILED',
        totalClients: chargeLogInput.totalClients,
        successfulCount: chargeLogInput.successfulCount,
        failedCount: chargeLogInput.failedCount,
        totalAmount: chargeLogInput.totalAmount,
        disabledPeers: chargeLogInput.disabledPeers,
        failedDetails: chargeLogInput.failedDetails,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
}
