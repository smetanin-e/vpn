'use client';

import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/ui';
import { CheckCircle2, XCircle, Users, AlertTriangle, UserX } from 'lucide-react';
import { ChargeLog } from '../model/types.type';
import { formatDateOnly } from '@/src/shared/lib/format-date';
import Link from 'next/link';
interface Props {
  data: ChargeLog;
}

export function ChargeLogsCard({ data }: Props) {
  const badgeStatus = data.status === 'COMPLETED' ? 'success' : 'destructive';
  const status = data.status === 'COMPLETED' ? 'Выполнено' : 'Ошибка';
  return (
    <Card className='w-full mb-6 border-slate-700 bg-slate-900/50 px-2 transition-colors hover:border-slate-600'>
      <CardHeader className='p-0'>
        <CardTitle className='md:text-center'>{formatDateOnly(data.date)}</CardTitle>
        <CardDescription></CardDescription>
        <CardAction>
          <Badge variant={badgeStatus}>{status}</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-6 px-0'>
        {/* Stats Grid */}
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          <div className='flex flex-col gap-1 rounded-lg border p-3'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Users className='h-4 w-4' />
              <span className='text-xs'>Всего клиентов</span>
            </div>
            <span className='text-2xl font-semibold'>{data.totalClients}</span>
          </div>

          <div className='flex flex-col gap-1 rounded-lg border p-3'>
            <div className='flex items-center gap-2 text-green-600'>
              <CheckCircle2 className='h-4 w-4' />
              <span className='text-xs'>Успешно</span>
            </div>
            <span className='text-2xl font-semibold text-green-600'>{data.successfulCount}</span>
          </div>

          <div className='flex flex-col gap-1 rounded-lg border p-3'>
            <div className='flex items-center gap-2 text-destructive'>
              <XCircle className='h-4 w-4' />
              <span className='text-xs'>Ошибки</span>
            </div>
            <span className='text-2xl font-semibold text-destructive'>{data.failedCount}</span>
          </div>

          <div className='flex flex-col gap-1 rounded-lg border p-3'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <span className='text-xs'>Списано ₽</span>
            </div>
            <span className='text-2xl font-semibold'>{data.totalAmount}</span>
          </div>
        </div>

        {/* Disabled Peers */}
        {data.disabledPeers.length > 0 && (
          <div className='space-y-3'>
            <h4 className='flex items-center gap-2 text-sm font-medium'>
              <UserX className='h-4 w-4 text-amber-500' />
              Отключённые клиенты ({data.disabledPeers.length})
            </h4>
            <div className='space-y-2'>
              {data.disabledPeers.map((peer) => (
                <div
                  key={peer.peerId}
                  className='flex items-center  gap-4 border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20'
                >
                  <Link href={`/client/id/${peer.clientId}`}>
                    {' '}
                    <span className='text-sm font-medium'>ClientID:{peer.clientId}</span>
                  </Link>

                  <p className='text-xs text-muted-foreground'>
                    {peer.reason} ({peer.newBalance} ₽)
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed Details */}
        {data.failedDetails.length > 0 && (
          <div className='space-y-3'>
            <h4 className='flex items-center gap-2 text-sm font-medium'>
              <AlertTriangle className='h-4 w-4 text-destructive' />
              Детали ошибок ({data.failedDetails.length})
            </h4>
            <div className='space-y-2'>
              {data.failedDetails.map((detail, index) => (
                <div
                  key={index}
                  className='flex flex-col gap-1 border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20'
                >
                  <Link href={`/client/id/${detail.clientId}`}>
                    {' '}
                    <span className='text-sm font-medium'>ClientID:{detail.clientId}</span>
                  </Link>

                  <p className='break-all font-mono text-xs text-destructive'>
                    Причина ошибки: {detail.error} ({detail.step})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
