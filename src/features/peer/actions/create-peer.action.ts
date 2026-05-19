'use server';
import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { userRepository } from '@/src/entities/user/repository/user.repository';
import { createPeerApi } from '../api/create-peer-api';
import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/src/shared/lib/errors/app-error';
import { handleActionError } from '@/src/shared/lib/action-error-handler';
import { logger } from '@/src/shared/lib/logger';

type CreatePeerData = {
  serverId: number;
  tariff: number;
  clientName: string;
  clientDescription: string;
  adminId: number;
};

export async function createPeerAction(data: CreatePeerData) {
  let createdPeerId: string | null = null;
  let createdClientId: number | null = null;
  let peerApiInstance = null;

  try {
    const user = await userRepository.findUserById(data.adminId);
    if (!user) {
      throw new UnauthorizedError('Пользователь не авторизован');
    }

    const server = await serverRepository.findById(data.serverId);
    if (!server) {
      throw new NotFoundError('Сервер не найден');
    }

    peerApiInstance = createPeerApi(server);

    const client = await clientRepository.createClient(
      data.clientName,
      data.clientDescription,
      data.tariff,
    );
    if (!client) {
      throw new ValidationError('Не удалось создать клиента в базе данных');
    }

    createdClientId = client.id;

    const peerName = `ClientID:${client.id}`;
    const peer = await peerApiInstance.create(peerName);
    if (!peer || !peer.id) {
      throw new ValidationError('Не удалось создать пир на сервере');
    }

    createdPeerId = peer.id;

    const savedPeer = await peerRepository.createPeerDb(
      client.id,
      server.id,
      peer.id,
      peerName,
      peer.config,
    );

    if (!savedPeer) {
      throw new ValidationError('Не удалось сохранить пир в базе данных');
    }

    logger.info(`[CREATE_PEER_ACTION] Peer created successfully`, {
      peerId: savedPeer.id,
      clientId: client.id,
      adminId: data.adminId,
    });

    return {
      success: true,
      message: 'Пир успешно создан',
      data: {
        peerId: savedPeer.id,
        clientId: client.id,
        config: peer.config,
      },
    };
  } catch (error) {
    // 💥 Удалить пир, если что-то пошло не так
    if (createdPeerId && peerApiInstance) {
      try {
        await peerApiInstance.delete(createdPeerId);

        logger.info(`Rollback: peer ${createdPeerId} удалён`);
      } catch (deleteError) {
        logger.error(`[ROLLBACK FAILED] Не удалось удалить peer ${createdPeerId}:`, deleteError);
        return handleActionError(error);
      }
    }

    // Удаляем клиента из БД, если он был создан
    if (createdClientId) {
      try {
        await clientRepository.deleteClient(createdClientId);
        logger.info(`[ROLLBACK] Клиент ${createdClientId} удалён из БД`);
      } catch (deleteError) {
        logger.error(
          `[ROLLBACK FAILED] Не удалось удалить клиента ${createdClientId}:`,
          deleteError,
        );
        handleActionError(error);
      }
    }
    logger.error(`[CREATE_PEER_ACTION] Action failed`, error);

    return handleActionError(error);
  }
}
