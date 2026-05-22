'use client';

import { clientAxiosInstance } from '@/src/shared/api/client';
import { Button } from '@/src/shared/components/ui';
import { logger } from '@/src/shared/lib/logger';
import { RefreshCw } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface Props {
  className?: string;
}

export const SyncTraffic: React.FC<Props> = () => {
  const [loading, setLoading] = React.useState(false);
  const fetchTraffic = async () => {
    try {
      setLoading(true);
      await clientAxiosInstance.post('/internal/sync-traffic');
      setLoading(false);
      toast.success('Трафик синхронизирован');
      logger.info('[API_INTERNAL_SYNC_TRAFFIC] Успешный запрос на синхронизацию трафика');
    } catch (error) {
      toast.error('Ошибка синхронизации трафика');
      logger.error('[API_INTERNAL_SYNC_TRAFFIC] fetchTraffic error', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button size={'icon'} disabled={loading} variant={'outline'} onClick={fetchTraffic}>
      <RefreshCw />
    </Button>
  );
};
