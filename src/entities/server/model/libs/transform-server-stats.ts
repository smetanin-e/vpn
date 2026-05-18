import { ServerStatsInput, ServerStatsOutput } from '../types/server-stats.types';

export function transformServerStats(servers: ServerStatsInput[]): ServerStatsOutput[] {
  return servers.map((server) => {
    // Подсчитываем активные и неактивные пиры
    const active = server.peers.filter((peer) => peer.status === 'ACTIVE').length;
    const inactive = server.peers.length - active;
    const total = active + inactive;

    return {
      serverId: server.id,
      serverName: server.name,
      serverDescription: server.description,
      serverType: server.type,
      peers: {
        active,
        inactive,
        total,
      },
    };
  });
}
