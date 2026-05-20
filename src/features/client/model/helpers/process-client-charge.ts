import { TransactionType } from '@/generated/prisma/client';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { getPeerApi } from '@/src/features/peer/api/peer-api-cache';

import { prisma } from '@/src/shared/lib/prisma';

import { ClientDTO } from '@/src/entities/client/model/types';
import { logger } from '@/src/shared/lib/logger';

export type ClientChargeResult = {
  success: boolean;
  clientId: number;
  newBalance?: number;
  wasDisabled?: boolean;
  error?: string;
  timestamp: string;
};

type ProcessSuccess = {
  success: true;
  clientId: number;
  newBalance: number;
  amount: number;
  peerId: number;
  disabled: boolean;
  disabledReason?: string;
  error?: string;
  step?: 'disable_peer'; // Может быть, если баланс обновился, но пир не отключился
};

type ProcessFailure = {
  success: false;
  clientId: number;
  newBalance?: number;
  disabled: false;
  error: string;
  step: 'update_balance' | 'api_call' | 'disable_peer';
};

type ProcessResult = ProcessSuccess | ProcessFailure;

export async function processClientChargeWithLog(client: ClientDTO): Promise<ProcessResult> {
  const clientId = client.id;
  const tariff = client.tariff;
  const balance = client.balance;

  if (!client.peer || !client.peer.server) {
    logger.warn(`[CHARGE] Client ${clientId} has no peer, skipping`);
    return {
      success: false,
      clientId,
      newBalance: balance,
      disabled: false,
      error: 'Peer not found',
      step: 'api_call',
    };
  }

  const api = getPeerApi(client.peer.server);
  const newBalance = balance - tariff;

  try {
    // Обновляем баланс
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

    // Если баланс стал нулевым или отрицательным - отключаем пир
    let disabled = false;

    logger.info(
      `[CHARGE] Client ${clientId}: charged ${tariff}, ` + `balance: ${balance} → ${newBalance}`,
    );

    if (newBalance <= 0) {
      try {
        await api.changeEnable(client.peer.externalId, false);
        await peerRepository.updatePeerStatus(client.peer.id, false);
        disabled = true;
      } catch (disableError) {
        logger.error(`[CHARGE] Failed to disable peer for client ${clientId}`, disableError);
        return {
          success: false, // Баланс обновлен, но не отключен
          clientId,
          newBalance,
          disabled: false,
          error: disableError instanceof Error ? disableError.message : 'Failed to disable peer',
          step: 'disable_peer',
        };
      }
    }

    return {
      success: true,
      clientId,
      peerId: client.peer.id,
      amount: tariff,
      newBalance,
      disabled,
      disabledReason: disabled ? 'Отрицательный баланс' : undefined,
    };
  } catch (error) {
    logger.error(`[CHARGE] Transaction failed for client ${clientId}`, error);
    return {
      success: false,
      clientId,
      newBalance,
      disabled: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
      step: 'update_balance',
    };
  }
}
