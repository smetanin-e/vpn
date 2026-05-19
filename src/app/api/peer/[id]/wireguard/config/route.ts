import { getWgPeerConfig } from '@/src/entities/peer/api/get-wg-peer-config';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { createPeerApi } from '@/src/features/peer/api/create-peer-api';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { NotFoundError, UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = crypto.randomUUID();
  try {
    logger.info(`[VPN_CONFIG] Request ${requestId} started`);
    const authUser = await getUserSession();
    if (!authUser) {
      logger.warn(`[VPN_CONFIG] Request ${requestId} - unauthorized`);
      throw new UnauthorizedError('Пользователь не авторизован');
    }

    const dbPeerId = Number((await params).id);

    const peer = await peerRepository.findPeerById(dbPeerId);

    if (!peer) {
      logger.warn(`[VPN_CONFIG] Request ${requestId} - peer ${dbPeerId} not found`);
      throw new NotFoundError('Файл VPN конфигурации не найден');
    }

    const peerApiInstance = createPeerApi(peer.server!);

    let config;
    if ('downloadPeerConfig' in peerApiInstance) {
      // wireguarg config
      config = await getWgPeerConfig(peerApiInstance, peer.externalId);
    } else {
      config = peer.config;
    }

    if (!config) {
      logger.warn(`[VPN_CONFIG] Request ${requestId} - config not found`);
      throw new NotFoundError('Не удалось запросить конфиг. Ошибка на сервере WG');
    }

    logger.info(`[VPN_CONFIG] Request ${requestId} - config delivered for client ${peer.clientId}`);

    return new NextResponse(config, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="vpn${peer.clientId}.conf"`,
      },
    });
  } catch (error) {
    logger.error(`[VPN_CONFIG] Request ${requestId} failed`, error);
    return handleApiError(error);
  }
}
