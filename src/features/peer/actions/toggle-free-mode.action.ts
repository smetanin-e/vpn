'use server';

import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { handleActionError } from '@/src/shared/lib/action-error-handler';
import { NotFoundError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';

export async function toggleFreeModeAction(dbPeerId: number) {
  try {
    const peer = await peerRepository.findPeerById(dbPeerId);
    if (!peer) {
      throw new NotFoundError('Пир не найден');
    }

    const client = await clientRepository.findClientById(peer.clientId);
    if (!client) {
      throw new NotFoundError('Клиент не найден');
    }

    const currentMode = client.isFree;

    //обновляем БД

    await clientRepository.updateFreeMode(peer.clientId, !currentMode);

    return { success: true };
  } catch (error) {
    logger.error(`[TOGGLE_FREE_MODE] Server error`, error);
    return handleActionError(error);
  }
}
