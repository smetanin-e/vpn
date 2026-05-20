'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui';
import { EmptyData, LoadingBounce, ShowMore } from '@/src/shared/components';

import { cn } from '@/src/shared/lib/utils';
import { useDailyCharges } from '@/src/entities/daily-charge-logs/hooks/use-daily-charge';
import { ChargeLogsCard } from '@/src/entities/daily-charge-logs/ui/charge-logs-card';

interface Props {
  className?: string;
  clientId?: number;
}

export const Charges: React.FC<Props> = ({ className }) => {
  const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } = useDailyCharges();
  const charges = data?.pages.flatMap((page) => page.charges) ?? [];

  return (
    <Card
      className={cn(
        'relative mx-2 border-slate-700 bg-slate-800/50 pb-1 backdrop-blur-sm',
        className,
      )}
    >
      <CardHeader>
        <CardTitle className='text-white'>Операции списания</CardTitle>
        <CardDescription className='text-slate-300'>
          Фиксация ежедневного списания средств
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
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
      </CardContent>
    </Card>
  );
};
