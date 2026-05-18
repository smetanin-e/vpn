'use client';
import React from 'react';
import { cn } from '@/src/shared/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui';

import { useSearchParams } from 'next/navigation';
import { PeerSort, SortField, SortOrder } from '@/src/entities/peer/ui/peer-sort';
import { EmptyData, LoadingBounce, ShowMore } from '@/src/shared/components';
import { CreatePeerModal } from '@/src/features/peer/ui/create-peer-modal';
import { SearchPeer } from '@/src/entities/peer/ui/search-peer';
import { useGetPeers } from '@/src/entities/peer/model/hooks/use-get-peers';
import { PeerCard } from '@/src/entities/peer/ui/peer-card';
import { CreateServerModal } from '@/src/features/server/ui/create-server-modal';

interface Props {
  className?: string;
}

export const Peers: React.FC<Props> = () => {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = React.useState(searchParams.get('search') || '');

  // Состояния сортировки
  const [sortField, setSortField] = React.useState<SortField>('sentBytes');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');

  const { data, status, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetPeers(
    searchValue,
    sortField,
    sortOrder,
  );

  const peers = React.useMemo(() => {
    if (!data?.pages) return [];

    const uniqueMap = new Map();
    data.pages.forEach((page) => {
      page.peers.forEach((peer) => {
        if (!uniqueMap.has(peer.id)) {
          uniqueMap.set(peer.id, peer);
        }
      });
    });

    return Array.from(uniqueMap.values());
  }, [data]);

  const handleSort = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  if (status === 'error') {
    return (
      <div className='p-4 text-red-500'>
        Ошибка: {error instanceof Error ? error.message : 'Не удалось получить список пиров ❌'}
      </div>
    );
  }
  return (
    <Card
      className={cn(
        'relative min-h-80 max-w-full border-blue-600 bg-slate-800/50 backdrop-blur-sm',
      )}
    >
      <CardHeader>
        <CardTitle className='flex justify-between'>
          <h2>Профили клиентов</h2>
          <div className='flex flex-col items-end gap-2'>
            <CreateServerModal />
            <CreatePeerModal />
          </div>
        </CardTitle>

        <div className='grid grid-cols-1 md:grid-cols-2 mt-2 gap-4 '>
          {' '}
          <SearchPeer
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchParams={searchParams}
          />
          <div className='text-right'>
            <PeerSort sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-2 p-1'>
        {status === 'pending' && peers.length === 0 ? (
          <LoadingBounce />
        ) : peers.length === 0 ? (
          <EmptyData text='Нет конфигураций' />
        ) : (
          <>
            {peers.map((peer) => (
              <PeerCard key={peer.id} peer={peer} />
            ))}

            {hasNextPage && (
              <ShowMore onClick={() => fetchNextPage()} disabled={isFetchingNextPage} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
