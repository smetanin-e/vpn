import { useQuery } from '@tanstack/react-query';

import { clientAxiosInstance } from '@/src/shared/api/client';
import { Server } from '@/generated/prisma/client';
import { ServerStatsOutput } from '../types/server-stats.types';

export const useGetServers = () => {
  return useQuery<Server[]>({
    queryKey: ['servers'],
    queryFn: async () => {
      return (await clientAxiosInstance.get<Server[]>('/server')).data;
    },
  });
};

export const useGetServersStats = () => {
  return useQuery<ServerStatsOutput[]>({
    queryKey: ['stats'],
    queryFn: async () => {
      return (await clientAxiosInstance.get<ServerStatsOutput[]>('/server/stats')).data;
    },
  });
};
