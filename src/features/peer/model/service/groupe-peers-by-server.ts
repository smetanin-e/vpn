import { Server } from '@/generated/prisma/client';

type PeerWithServer = {
  server?:
    | (Pick<Server, 'id' | 'type' | 'name' | 'description' | 'baseUrl' | 'apiToken'> & {
        id: number;
      })
    | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function groupPeersByServer<T extends PeerWithServer>(peers: T[]): Map<number, T[]> {
  const map = new Map<number, T[]>();

  for (const peer of peers) {
    const server = peer.server;
    if (!server?.id) continue;

    if (!map.has(server.id)) {
      map.set(server.id, []);
    }
    map.get(server.id)!.push(peer);
  }

  return map;
}
