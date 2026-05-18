'use client';
import { ShieldCheck, ShieldMinus } from 'lucide-react';

import { Logo } from '@/src/shared/components';
import { useGetServersStats } from '../model/hooks/use-get-servers';

interface Props {
  className?: string;
}
export const ServerStats: React.FC<Props> = ({}) => {
  const { data: stats, isLoading } = useGetServersStats();

  if (!isLoading && !stats) {
    return;
  }
  return (
    <div className='mb-2'>
      <h1 className='mb-2'>Список серверов:</h1>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          {stats?.map((server) => (
            <div key={server.serverId} className='md:mb-2 mb-4 text-sm'>
              <div className='grid md:grid-cols-[140px_220px_auto] grid-cols-[1fr_220px] items-center gap-1'>
                <div className='flex items-center gap-2'>
                  <Logo width={25} height={25} type={server.serverType} />
                  <p className='text-xs md:text-sm'>{server.serverName}</p>
                </div>

                <div className='grid md:grid-cols-[110_50_50] grid-cols-[95_40_40] items-center gap-1 text-xs md:text-sm'>
                  <div className='ml-2 flex items-center space-x-1 text-orange-300'>
                    <p className='font-bold'>Клиентов: {server.peers.total}</p>
                  </div>
                  <div className='ml-2 flex items-center space-x-1 text-green-300'>
                    <ShieldCheck className='h-4 w-4' />
                    <p className='font-bold'>{server.peers.active}</p>
                  </div>

                  <div className='flex items-center space-x-1 text-red-400'>
                    <ShieldMinus className='h-4 w-4' />
                    <p className='font-bold'>{server.peers.inactive}</p>
                  </div>
                </div>

                <p className='text-xs text-muted-foreground sm:col-auto col-span-2 w-full'>
                  {server.serverDescription}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
