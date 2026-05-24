import { useQuery } from '@tanstack/react-query';

import { clientAxiosInstance } from '@/src/shared/api/client';
import { PeerQueryType } from '../types/types';
import { useErrorHandler } from '@/src/shared/lib/use-error-handler';

export const useGetPeer = (id: number) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['peer', id], // ← id в queryKey
    queryFn: async () => {
      try {
        const { data } = await clientAxiosInstance.get<PeerQueryType>(`/peer/${id}`);
        return data;
      } catch (error) {
        handleError(error, 'Не удалось загрузить данные пира');
        throw error;
      }
    },
    enabled: !!id, // ← не выполнять запрос, если id нет
  });
};
