import { AmneziaPeersResponse } from '@/src/features/peer/model/types/amnezia-api.types';
import { WireGuardPeerResponse } from '@/src/features/peer/model/types/wg-api.types';
import { TrafficData } from '../types';

type Params = {
  amneziaResponse?: AmneziaPeersResponse;
  wgResponse?: WireGuardPeerResponse[];
};

export function normalizeTrafficData({ amneziaResponse, wgResponse }: Params): TrafficData[] {
  const result: TrafficData[] = [];

  // Обработка Amnezia API данных
  if (amneziaResponse?.items) {
    for (const item of amneziaResponse.items) {
      for (const peer of item.peers) {
        let lastHandshake: Date | null = null;

        if (peer.lastHandshake && peer.lastHandshake > 0) {
          lastHandshake = new Date(peer.lastHandshake * 1000); // секунды -> Date
        }
        result.push({
          externalId: peer.id,
          traffic: {
            received: peer.traffic?.received || 0,
            sent: peer.traffic?.sent || 0,
          },
          lastHandshake,
        });
      }
    }
  }

  // Обработка WireGuard API данных
  if (Array.isArray(wgResponse)) {
    for (const peer of wgResponse) {
      let lastHandshake: Date | null = null;

      if (peer.last_online && typeof peer.last_online === 'string') {
        const date = new Date(peer.last_online);
        if (!isNaN(date.getTime())) {
          lastHandshake = date;
        }
      }

      result.push({
        externalId: String(peer.id), // id из WG API (число)
        traffic: {
          received: peer.traffic?.received || 0,
          sent: peer.traffic?.sent || 0,
        },
        lastHandshake,
      });
    }
  }

  return result;
}
