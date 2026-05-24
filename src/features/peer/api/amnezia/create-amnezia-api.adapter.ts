import { Server } from '@/generated/prisma/client';
import { createApiClient } from '../create-api-client';
import {
  AmneziaChangeStatusResponse,
  AmneziaCreatePeerResponse,
  AmneziaDeletePeerResponse,
  AmneziaPeersResponse,
} from '../../model/types/amnezia-api.types';
import { TrafficData } from '@/src/entities/peer/model/types/types';
import { normalizeTrafficData } from '@/src/entities/peer/model/lib/normalize-traffic-data';

export type AmneziaPeerApiType = {
  getAllPeers(): Promise<AmneziaPeersResponse>;

  getTrafficData(): Promise<TrafficData[]>;

  create(name: string): Promise<{ id: string; config: string }>;

  changeEnable(peerId: string, enable: boolean): Promise<void>;

  delete(peerId: string): Promise<void>;
};

//'active' | 'disabled'

export function createAmneziaApiAdapter(server: Server): AmneziaPeerApiType {
  const client = createApiClient(server);

  return {
    async getAllPeers(): Promise<AmneziaPeersResponse> {
      const res = await client.get<AmneziaPeersResponse>(`/clients`);
      return res.data;
    },

    async getTrafficData(): Promise<TrafficData[]> {
      const res = await client.get<AmneziaPeersResponse>(`/clients`);
      return normalizeTrafficData({ amneziaResponse: res.data });
    },

    async create(clientName: string): Promise<{ id: string; config: string }> {
      const res = await client.post<AmneziaCreatePeerResponse>('/clients', {
        clientName,
        protocol: 'amneziawg2',
      });

      const data = { id: res.data.client.id, config: res.data.client.config };
      return data;
    },

    async changeEnable(peerId: string, enable: boolean): Promise<void> {
      const status = enable ? 'active' : 'disabled';
      console.log({ status, clientId: peerId });
      await client.patch<AmneziaChangeStatusResponse>('/clients', {
        status,
        clientId: peerId,
        protocol: 'amneziawg2',
      });
      return;
    },

    async delete(peerId: string): Promise<void> {
      await client.delete<AmneziaDeletePeerResponse>('/clients', {
        data: {
          clientId: peerId,
          protocol: 'amneziawg2',
        },
      });
      return;
    },
  };
}
