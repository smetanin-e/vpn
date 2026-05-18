import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/src/shared/lib/query-client';
import { toast } from 'sonner';
import { createServerAction } from '../../actions/create-server.action';

export const useServerMutations = () => {
  const createServer = useMutation({
    mutationFn: createServerAction,
    onSuccess: async (res) => {
      if (res.success) {
        await Promise.all([queryClient.invalidateQueries({ queryKey: ['servers'] })]);
        toast.success('VPN сервер успешно добавлен');
      } else {
        toast.error(res.message || 'Ошибка при добавлении VPN сервера');
      }
    },
  });

  return {
    createServer,
  };
};
