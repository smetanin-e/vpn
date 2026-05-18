import { ServerType } from '@/generated/prisma/enums';

export type ServerStatsInput = {
  id: number;
  name: string;
  description: string;
  type: ServerType;
  peers: { id: number; status: string }[];
};

export type ServerStatsOutput = {
  serverId: number;
  serverName: string;
  serverDescription: string;
  serverType: ServerType;
  peers: {
    active: number;
    inactive: number;
    total: number;
  };
};
