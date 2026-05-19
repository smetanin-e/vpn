import { Server, ServerType } from '@/generated/prisma/client';
import { createAmneziaApiAdapter } from './amnezia/create-amnezia-api.adapter';
import { createWgRestApiAdapter } from './wireguard/create-wg-rest-api.adapter';
import { TrafficData } from '@/src/entities/peer/model/types';
import { AppError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';

export type PeerApiType = {
  create(name: string): Promise<{ id: string; config?: string }>;
  getTrafficData(): Promise<TrafficData[]>;
  changeEnable(peerId: string, enable: boolean): Promise<void>;
  delete(peerId: string): Promise<void>;
  downloadPeerConfig?(peerId: string): Promise<string>;
};

export function createPeerApi(server: Server): PeerApiType {
  switch (server.type) {
    case ServerType.WG_REST_API:
      return createWgRestApiAdapter(server);
    case ServerType.AMNEZIA_API:
      return createAmneziaApiAdapter(server);
    default:
      logger.error(`[PEER_API] Unsupported server type: ${server.type}`, {
        serverId: server.id,
        type: server.type,
      });

      throw new AppError(
        `Неподдерживаемый тип сервера: ${server.type}`,
        500,
        'UNSUPPORTED_SERVER_TYPE',
      );
  }
}
