'use server';

import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { createPeerApi } from '../api/create-peer-api';
import { transactionRepository } from '@/src/entities/transaction/repository/transaction-repository';
import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { serverRepository } from '@/src/entities/server/repository/server.repository';

export async function deletePeerAction(dbPeerId: number) {
  try {
    const peer = await peerRepository.findPeerById(dbPeerId);
    if (!peer) {
      return { success: false, message: 'Конфигурация не найдена' };
    }

    const client = await clientRepository.findClientById(peer.clientId);
    if (!client) {
      return { success: false, message: 'Клиент не найден' };
    }

    const server = await serverRepository.findById(peer.serverId);
    if (!server) {
      return { success: false, message: 'Сервер не найден' };
    }

    const peerApiInstance = createPeerApi(server);

    await peerApiInstance.delete(peer.externalId);
    //TODO Если база не доступна, то пир удалится на сервере, но останется в базе. Нужно как-то обрабатывать такие ситуации.
    await peerRepository.deletePeer(peer.id);
    await transactionRepository.deleteByClientId(client.id);
    await clientRepository.deleteClient(client.id);

    return { success: true };
  } catch (error) {
    console.error('[DELETE_PEER] Server error', error);
    return { success: false, message: 'Ошибка удаления пира' };
  }
}
