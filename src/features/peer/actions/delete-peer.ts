'use server';

import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { createPeerApi } from '../api/create-peer-api';
import { transactionRepository } from '@/src/entities/transaction/repository/transaction-repository';
import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { AppError, NotFoundError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';
import { handleActionError } from '@/src/shared/lib/action-error-handler';
import { handlePeerApiError } from '../model/lib/handle-api-delete-error';

export async function deletePeerAction(dbPeerId: number) {
  try {
    const peer = await peerRepository.findPeerById(dbPeerId);
    if (!peer) {
      throw new NotFoundError('Пир не найден');
    }

    const client = await clientRepository.findClientById(peer.clientId);
    if (!client) {
      throw new NotFoundError('Клиент не найден');
    }

    const server = await serverRepository.findById(peer.serverId);
    if (!server) {
      throw new NotFoundError('Сервер не найден');
    }

    logger.info(`[DELETE_PEER] Начинаем удаление пира ${dbPeerId}`, {
      peerId: dbPeerId,
      externalId: peer.externalId,
      clientId: client.id,
      clientName: client.name,
      serverId: server.id,
    });

    const peerApiInstance = createPeerApi(server);
    let deletedFromServer = false;

    try {
      await peerApiInstance.delete(peer.externalId);
      deletedFromServer = true;
      logger.info(`[DELETE_PEER] VPN ClientID: ${peer.clientId} удален на сервере`);
    } catch (apiError) {
      if (
        !handlePeerApiError(apiError, {
          peerId: dbPeerId,
          externalId: peer.externalId,
        })
      ) {
        throw apiError; // пробрасываем только если ошибка не "peer not found"
      }
    }

    try {
      await Promise.all([
        peerRepository.deletePeer(peer.id),
        transactionRepository.deleteByClientId(client.id),
        clientRepository.deleteClient(client.id),
      ]);

      logger.info(`[DELETE_PEER] Пир успешно удален из БД`, {
        peerId: dbPeerId,
        deletedFromServer,
      });

      const message = deletedFromServer
        ? 'Пир успешно удален с сервера и из БД'
        : 'Пир удален из БД (на сервере уже отсутствовал)';

      return { success: true, message };
    } catch (dbError) {
      logger.error(`[DELETE_PEER] КРИТИЧЕСКАЯ ОШИБКА: Пир удален на сервере, но не в БД`, {
        peerId: dbPeerId,
        externalId: peer.externalId,
        clientId: client.id,
        error: dbError instanceof Error ? dbError.message : 'Unknown',
      });
      throw new AppError(
        'Пир удален на сервере, но произошла ошибка при обновлении базы данных.',
        500,
        'DB_CLEANUP_NEEDED',
      );
    }
  } catch (error) {
    logger.error(`[DELETE_PEER] Server error`, error);
    return handleActionError(error);
  }
}
