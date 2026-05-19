import { TransactionType } from '@/generated/prisma/client';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { getPeerApi } from '@/src/features/peer/api/peer-api-cache';
import { logger } from '@/src/shared/lib/logger';
import { prisma } from '@/src/shared/lib/prisma';
import { ChargeTransactionError } from '../lib/charge-errors';
import { ClientDTO } from '@/src/entities/client/model/types';

export type ClientChargeResult = {
  success: boolean;
  clientId: number;
  newBalance?: number;
  wasDisabled?: boolean;
  error?: string;
  timestamp: string;
};

export async function processClientCharge(client: ClientDTO): Promise<ClientChargeResult> {
  const clientId = client.id;
  const tariff = client.tariff;
  const balance = client.balance;

  if (!client.peer || !client.peer.server) {
    logger.warn(`[CHARGE] Client ${clientId} has no peer, skipping`);

    return {
      success: false,
      clientId,
      error: 'Prre not found',
      timestamp: new Date().toISOString(),
    };
  }

  const api = getPeerApi(client.peer.server);
  const newBalance = balance - tariff;

  try {
    // Выполняем транзакцию списания
    await prisma.$transaction([
      prisma.client.update({
        where: { id: clientId },
        data: { balance: { decrement: tariff } },
      }),

      prisma.balanceTransaction.create({
        data: {
          clientId,
          amount: tariff,
          type: TransactionType.DAILY_CHARGE,
        },
      }),
    ]);

    logger.info(
      `[CHARGE] Client ${clientId}: charged ${tariff}, ` + `balance: ${balance} → ${newBalance}`,
    );

    // Если баланс стал отрицательным или нулевым - отключаем пир

    if (newBalance <= 0) {
      logger.warn(`[CHARGE] Client ${clientId} balance depleted, disabling peer`);

      try {
        await api.changeEnable(client.peer.externalId, false);
        await peerRepository.updatePeerStatus(client.peer.id, false);

        return {
          success: true,
          clientId,
          newBalance,
          wasDisabled: true,
          timestamp: new Date().toISOString(),
        };
      } catch (disableError) {
        logger.error(`[CHARGE] Failed to disable peer for client ${clientId}`, disableError);
        return {
          success: true,
          clientId,
          newBalance,
          wasDisabled: false,
          error: 'Peer disable failed',
          timestamp: new Date().toISOString(),
        };
      }
    }

    return {
      success: true,
      clientId,
      newBalance,
      wasDisabled: false,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`[CHARGE] Transaction failed for client ${clientId}`, error);
    throw new ChargeTransactionError(clientId, error as Error);
  }
}
