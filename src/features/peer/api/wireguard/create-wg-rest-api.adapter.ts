import { Server } from '@/generated/prisma/client';
import { createApiClient } from '../create-api-client';
import { WireGuardPeerResponse } from '../../model/types/wg-api.types';
import { TrafficData } from '@/src/entities/peer/model/types/types';
import { normalizeTrafficData } from '@/src/entities/peer/model/lib/normalize-traffic-data';

export type WgPeerApiType = {
  getAllPeers(): Promise<WireGuardPeerResponse[]>;

  getTrafficData(): Promise<TrafficData[]>;

  getConfigById(peerId: number): Promise<WireGuardPeerResponse>;

  downloadPeerConfig(peerId: string): Promise<string>;

  create(name: string): Promise<{ id: string }>;

  changeEnable(peerId: string, enable: boolean): Promise<void>;

  delete(peerId: string): Promise<void>;
};

export function createWgRestApiAdapter(server: Server): WgPeerApiType {
  const client = createApiClient(server);

  return {
    async getAllPeers(): Promise<WireGuardPeerResponse[]> {
      const res = await client.get<WireGuardPeerResponse[]>(`/api/clients`);
      return res.data;
    },

    async getTrafficData(): Promise<TrafficData[]> {
      const res = await client.get<WireGuardPeerResponse[]>(`/api/clients`);
      return normalizeTrafficData({ wgResponse: res.data });
    },

    async getConfigById(peerId: number) {
      const res = await client.get<WireGuardPeerResponse>(`/api/clients/${peerId}`);
      return res.data;
    },

    async downloadPeerConfig(peerId: string) {
      const res = await client.get(`/api/clients/${peerId}?format=conf`, {
        responseType: 'text',
      });

      return res.data;
    },

    async create(name: string) {
      const res = await client.post<WireGuardPeerResponse>('/api/clients', {
        name,
      });
      const data = { id: String(res.data.id) };
      return data;
    },

    async changeEnable(peerId: string, enable: boolean) {
      return client.patch(`/api/clients/${peerId}`, { enable });
    },

    async delete(peerId: string) {
      return client.delete(`/api/clients/${peerId}`);
    },
  };
}
