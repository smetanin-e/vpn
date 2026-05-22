'use client';
import React from 'react';

import { EmptyData, LoadingBounce, ShowMore } from '@/src/shared/components';

import { useDailyCharges } from '@/src/entities/daily-charge-logs/hooks/use-daily-charge';
import { ChargeLogsCard } from '@/src/entities/daily-charge-logs/ui/charge-logs-card';

interface Props {
  className?: string;
}

export const Charges: React.FC<Props> = () => {
  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } = useDailyCharges();
  const charges = data?.pages.flatMap((page) => page.charges) ?? [];

  return (
    <div>
      <div>
        <h1 className='text-center mb-2'>Операции списания</h1>
        <p className='text-slate-300 mb-4 text-center'>Фиксация ежедневного списания средств</p>
      </div>
      <div className='p-0'>
        {isLoading ? (
          <LoadingBounce />
        ) : (
          <>
            {charges.length === 0 ? (
              <EmptyData text='Данные отсутствуют' />
            ) : (
              <div>
                {charges.map((charge) => (
                  <ChargeLogsCard key={charge.id} data={charge} />
                ))}
              </div>
            )}
          </>
        )}
        {hasNextPage && <ShowMore onClick={() => fetchNextPage()} disabled={isFetchingNextPage} />}
      </div>
    </div>
  );
};
