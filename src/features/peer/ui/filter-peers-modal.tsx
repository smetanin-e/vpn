'use client';

import { Filter } from 'lucide-react';
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
} from '@/src/shared/components/ui';
import { useGetServersStats } from '@/src/entities/server/model/hooks/use-get-servers';
import React from 'react';

export interface FiltersState {
  serverIds: number[];
  isFree: boolean | null;
}

interface FiltersModalProps {
  className?: string;
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  isLoading?: boolean;
}

export const FilterPeersModal: React.FC<FiltersModalProps> = ({
  className,
  filters,
  onFiltersChange,
  isLoading = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState<FiltersState>(filters);

  const { data } = useGetServersStats();
  const servers = data ?? [];

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleServerChange = (serverId: number, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      serverIds: checked
        ? [...prev.serverIds, serverId]
        : prev.serverIds.filter((id) => id !== serverId),
    }));
  };

  // Обработчик изменения типа тарифа
  const handleTariffChange = (type: 'paid' | 'free', checked: boolean) => {
    if (type === 'paid') {
      // Платные = isFree = false
      setLocalFilters((prev) => ({
        ...prev,
        isFree: checked ? false : prev.isFree === true ? true : null,
      }));
    } else {
      // free
      // Бесплатные = isFree = true
      setLocalFilters((prev) => ({
        ...prev,
        isFree: checked ? true : prev.isFree === false ? false : null,
      }));
    }
  };

  // Вычисляем выбранные типы тарифов
  const isPaidSelected = localFilters.isFree === false;
  const isFreeSelected = localFilters.isFree === true;
  const isAllTariffsSelected = localFilters.isFree === null;

  const handleSelectAllTariffs = (checked: boolean) => {
    if (checked) {
      setLocalFilters((prev) => ({
        ...prev,
        isFree: null,
      }));
    }
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FiltersState = {
      serverIds: [],
      isFree: null,
    };
    setLocalFilters(resetFilters);
  };

  // Подсчет активных фильтров
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.serverIds.length > 0) count++;
    if (filters.isFree !== null) count++;
    return count;
  };

  return (
    <div className={className}>
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogTrigger asChild>
          <Button size='icon' variant='outline' disabled={isLoading} className='relative'>
            <Filter className='w-4 h-4' />

            {getActiveFiltersCount() > 0 && (
              <Badge className='absolute -top-2 text-secondary -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs'>
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className='min-w-sm bg-linear-to-br from-slate-900 via-blue-900 to-slate-900'>
          <DialogHeader className='space-y-1'>
            <DialogTitle className='text-center text-2xl font-bold'>Фильтры</DialogTitle>
            <DialogDescription className='text-center'>
              Выберите параметры для фильтрации
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6'>
            {/* Серверы */}
            <div className='space-y-3'>
              <Label className='text-base font-semibold text-white'>Серверы</Label>
              <div className='space-y-2 max-h-48 overflow-y-auto'>
                {servers.map((server) => (
                  <div key={server.serverId} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`server-${server.serverId}`}
                      checked={localFilters.serverIds.includes(server.serverId)}
                      onCheckedChange={(checked) =>
                        handleServerChange(server.serverId, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`server-${server.serverId}`}
                      className='cursor-pointer text-sm font-normal text-slate-200'
                    >
                      {server.serverName}
                    </Label>
                  </div>
                ))}
                {servers.length === 0 && (
                  <p className='text-sm text-slate-400'>Нет доступных серверов</p>
                )}
              </div>
              {localFilters.serverIds.length > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-xs text-slate-400 hover:text-white'
                  onClick={() => setLocalFilters((prev) => ({ ...prev, serverIds: [] }))}
                >
                  Очистить ({localFilters.serverIds.length})
                </Button>
              )}
            </div>

            {/* Тариф */}
            <div className='space-y-3'>
              <Label className='text-base font-semibold text-white'>Тип доступа</Label>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='tariff-all'
                    checked={isAllTariffsSelected}
                    onCheckedChange={handleSelectAllTariffs}
                  />
                  <Label
                    htmlFor='tariff-all'
                    className='cursor-pointer text-sm font-normal text-slate-200'
                  >
                    Все типы
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='tariff-paid'
                    checked={isPaidSelected}
                    onCheckedChange={(checked) => handleTariffChange('paid', checked as boolean)}
                  />
                  <Label
                    htmlFor='tariff-paid'
                    className='cursor-pointer text-sm font-normal text-slate-200'
                  >
                    Платные
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='tariff-free'
                    checked={isFreeSelected}
                    onCheckedChange={(checked) => handleTariffChange('free', checked as boolean)}
                  />
                  <Label
                    htmlFor='tariff-free'
                    className='cursor-pointer text-sm font-normal text-slate-200'
                  >
                    Бесплатные
                  </Label>
                </div>
              </div>
            </div>

            {/* Предпросмотр активных фильтров */}
            {(localFilters.serverIds.length > 0 || localFilters.isFree !== null) && (
              <div className='space-y-2 pt-2 border-t border-slate-700'>
                <Label className='text-sm font-semibold text-slate-300'>Активные фильтры:</Label>
                <div className='flex flex-wrap gap-2'>
                  {localFilters.serverIds.map((id) => {
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
                  {localFilters.isFree === true && (
                    <span className='inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-500/20 text-green-300'>
                      Бесплатные
                    </span>
                  )}
                  {localFilters.isFree === false && (
                    <span className='inline-flex items-center px-2 py-1 rounded-md text-xs bg-yellow-500/20 text-yellow-300'>
                      Платные
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className='mt-4 gap-2'>
            <Button variant='outline' onClick={handleReset}>
              Сбросить все
            </Button>
            <Button onClick={handleApply}>Применить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
