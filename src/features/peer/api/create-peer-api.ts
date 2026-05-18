import { Server, ServerType } from '@/generated/prisma/client';
import { createAmneziaApiAdapter } from './amnezia/create-amnezia-api.adapter';
import { createWgRestApiAdapter } from './wireguard/create-wg-rest-api.adapter';
import { TrafficData } from '@/src/entities/peer/model/types';

export type PeerApiType = {
  //   getAllPeers(): Promise<any>;
  create(name: string): Promise<{ id: string; config?: string }>;
  getTrafficData(): Promise<TrafficData[]>;
  changeEnable(peerId: string, enable: boolean): Promise<void>;
  delete(peerId: string): Promise<void>;
  //   getConfigById?(peerId: number): Promise<WireGuardPeerResponse>;
  downloadPeerConfig?(peerId: string): Promise<string>;
};

export function createPeerApi(server: Server): PeerApiType {
  switch (server.type) {
    case ServerType.WG_REST_API:
      return createWgRestApiAdapter(server);
    case ServerType.AMNEZIA_API:
      return createAmneziaApiAdapter(server);
    default:
      throw new Error(`Unsupported server type: ${server.type}`);
  }
}
