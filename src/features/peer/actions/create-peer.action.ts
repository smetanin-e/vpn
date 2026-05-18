'use server';
import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { userRepository } from '@/src/entities/user/repository/user.repository';
import { createPeerApi } from '../api/create-peer-api';
import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';

type CreatePeerData = {
  serverId: number;
  tariff: number;
  clientName: string;
  clientDescription: string;
  adminId: number;
};

export async function createPeerAction(data: CreatePeerData) {
  let createdPeerId: string | null = null;
  let peerApiInstance = null;

  try {
    const user = await userRepository.findUserById(data.adminId);
    if (!user) {
      return { success: false, message: 'Администратор не найден' };
    }

    const server = await serverRepository.findById(data.serverId);
    if (!server) {
      return { success: false, message: 'Сервер не найден' };
    }

    peerApiInstance = createPeerApi(server);

    const client = await clientRepository.createClient(
      data.clientName,
      data.clientDescription,
      data.tariff,
    );
    if (!client) {
      return { success: false, message: 'Ошибка при создании клиента в БД' };
    }
    const peerName = `ClientID:${client.id}`;
    const peer = await peerApiInstance.create(peerName);
    if (!peer) {
      return { success: false, message: 'Ошибка при создании пира на сервере' };
    }
    createdPeerId = peer.id;

    await peerRepository.createPeerDb(client.id, server.id, peer.id, peerName, peer.config);

    return { success: true, message: 'Пир успешно создан' };
  } catch (error) {
    // 💥 Удалить пир, если что-то пошло не так
    if (createdPeerId && peerApiInstance) {
      try {
        //TODO ДОБАВИТЬ УДАЛЕНИЕ КЛИЕНТА
        await peerApiInstance.delete(createdPeerId);
        console.log(`Rollback: peer ${createdPeerId} удалён`);
      } catch (deleteError) {
        console.error('Rollback failed: не удалось удалить пир', deleteError);
      }
    }
    console.error('[CREATE_PEER] Server error', error);
    return { success: false, message: 'Ошибка создания пира' };
  }
}
