import { ServerStatsOutput } from '@/src/entities/server/model/types/server-stats.types';
import { Button, Checkbox, Label } from '@/src/shared/components/ui';

interface ServerFilterProps {
  servers: ServerStatsOutput[];
  selectedServerIds: number[];
  onServerChange: (serverId: number, checked: boolean) => void;
  onClear: () => void;
}

export const ServerFilter: React.FC<ServerFilterProps> = ({
  servers,
  selectedServerIds,
  onServerChange,
  onClear,
}) => {
  return (
    <div className='space-y-3'>
      <Label className='text-base font-semibold text-white'>Серверы</Label>
      <div className='space-y-2 max-h-48 overflow-y-auto'>
        {servers.map((server) => (
          <div key={server.serverId} className='flex items-center space-x-2'>
            <Checkbox
              id={`server-${server.serverId}`}
              checked={selectedServerIds.includes(server.serverId)}
              onCheckedChange={(checked) => onServerChange(server.serverId, checked as boolean)}
            />
            <Label
              htmlFor={`server-${server.serverId}`}
              className='cursor-pointer text-sm font-normal text-slate-200'
            >
              {server.serverName}
            </Label>
          </div>
        ))}
        {servers.length === 0 && <p className='text-sm text-slate-400'>Нет доступных серверов</p>}
      </div>
      {selectedServerIds.length > 0 && (
        <Button
          variant='ghost'
          size='sm'
          className='text-xs text-slate-400 hover:text-white'
          onClick={onClear}
        >
          Очистить ({selectedServerIds.length})
        </Button>
      )}
    </div>
  );
};
