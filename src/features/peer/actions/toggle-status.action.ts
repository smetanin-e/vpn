'use server';

import { PeerStatus } from '@/generated/prisma/enums';

import { createPeerApi } from '../api/create-peer-api';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { NotFoundError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';
import { handleActionError } from '@/src/shared/lib/action-error-handler';

export async function togglePeerStatusAction(dbPeerId: number) {
  try {
    const peer = await peerRepository.findPeerById(dbPeerId);
    if (!peer) {
      throw new NotFoundError('Пир не найден');
    }

    const currentStatus = peer.status;
    const isDeactivating = currentStatus === PeerStatus.ACTIVE;

    const server = await serverRepository.findById(peer.serverId);
    if (!server) {
      throw new NotFoundError('Сервер не найден');
    }

    const peerApiInstance = createPeerApi(server);
    //меняем статус на сервере WG
    await peerApiInstance.changeEnable(peer.externalId, !isDeactivating);

    //обновляем БД
    await peerRepository.updatePeerStatus(peer.id, !isDeactivating);

    return { success: true, message: 'Статус изменен' };
  } catch (error) {
    logger.error(`[TOGGLE_STATUS_PEER] Server error`, error);
    return handleActionError(error);
  }
}
