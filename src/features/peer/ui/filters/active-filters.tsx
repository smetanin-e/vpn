import { ServerStatsOutput } from '@/src/entities/server/model/types/server-stats.types';
import { Label } from '@/src/shared/components/ui';
import React from 'react';

interface Props {
  serverIds: number[];
  servers: ServerStatsOutput[];
  isFree: boolean | null;
}

export const ActiveFilters: React.FC<Props> = ({ serverIds, servers, isFree }) => {
  if (serverIds.length === 0 && isFree === null) {
    return null;
  }

  return (
    <div className='space-y-2 pt-2 border-t border-slate-700'>
      <Label className='text-sm font-semibold text-slate-300'>Активные фильтры:</Label>
      <div className='flex flex-wrap gap-2'>
        {serverIds.map((id) => {
          const server = servers.find((s) => s.serverId === id);
          return (
            <span
              key={id}
              className='inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-500/20 text-blue-300'
            >
              {server?.serverName || `Сервер ${id}`}
            </span>
          );
        })}
        {isFree === true && (
          <span className='inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-500/20 text-green-300'>
            Бесплатные
          </span>
        )}
        {isFree === false && (
          <span className='inline-flex items-center px-2 py-1 rounded-md text-xs bg-yellow-500/20 text-yellow-300'>
            Платные
          </span>
        )}
      </div>
    </div>
  );
};
