'use server';

import { PeerStatus } from '@/generated/prisma/enums';
import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { transactionRepository } from '@/src/entities/transaction/repository/transaction-repository';
import { createPeerApi } from '../../peer/api/create-peer-api';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { NotFoundError, ValidationError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';
import { handleActionError } from '@/src/shared/lib/action-error-handler';

type CreditBalanceData = {
  clientId: number;
  count: string;
  key: string;
};
export async function topUpAction(data: CreditBalanceData) {
  try {
    const client = await clientRepository.findClienForTopUpBalance(data.clientId);
    if (!client) {
      throw new NotFoundError('Клиент не найден');
    }
    if (data.key !== process.env.CREDIT_BALANCE_SECRET) {
      throw new ValidationError('Неверный секретный ключ');
    }
    const newBalance = client.balance + parseInt(data.count);
    await clientRepository.updateBalance(data.clientId, newBalance);

    await transactionRepository.createTopUp({
      clientId: data.clientId,
      amount: parseInt(data.count),
    });

    if (client.peer?.status === PeerStatus.INACTIVE && newBalance > 0) {
      const peerApiInstance = createPeerApi(client.peer.server!);
      //меняем статус на сервере WG
      await peerApiInstance.changeEnable(client.peer!.externalId, true);
      //обновляем БД
      await peerRepository.updatePeerStatus(client.peer.id, true);
    }

    return { success: true, message: 'Баланс пополнен' };
  } catch (error) {
    logger.error(`[CREDIT_BALANCE_ACTION] Server error`, error);
    return handleActionError(error);
  }
}
