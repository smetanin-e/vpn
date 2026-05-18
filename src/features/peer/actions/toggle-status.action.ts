'use server';

import { PeerStatus } from '@/generated/prisma/enums';

import { createPeerApi } from '../api/create-peer-api';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { serverRepository } from '@/src/entities/server/repository/server.repository';

export async function togglePeerStatusAction(dbPeerId: number) {
  try {
    const peer = await peerRepository.findPeerById(dbPeerId);
    if (!peer) {
      return { success: false, message: 'Конфигурация не найдена' };
    }

    const currentStatus = peer.status;
    const isDeactivating = currentStatus === PeerStatus.ACTIVE;

    const server = await serverRepository.findById(peer.serverId);
    if (!server) {
      return { success: false, message: 'Сервер не найден' };
    }

    const peerApiInstance = createPeerApi(server);
    //меняем статус на сервере WG
    await peerApiInstance.changeEnable(peer.externalId, !isDeactivating);

    //обновляем БД
    await peerRepository.updatePeerStatus(peer.id, !isDeactivating);

    return { success: true };
  } catch (error) {
    console.error('[TOGGLE_STATUS_PEER] Server error', error);
    return { success: false, message: 'Ошибка изменения статуса' };
  }
}
