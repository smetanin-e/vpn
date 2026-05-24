'use client';

import { Filter } from 'lucide-react';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/components/ui';
import { useGetServersStats } from '@/src/entities/server/model/hooks/use-get-servers';
import React from 'react';
import { FilterPeersModalProps } from '../../model/types/filter-peers.types';
import { useFilterPeers } from '../../model/hooks/use-filter-peers';
import { ActiveFilters, ServerFilter, TariffFilter } from '@/src/features/peer/ui/filters';

export const FilterPeersModal: React.FC<FilterPeersModalProps> = ({
  className,
  filters,
  onFiltersChange,
  isLoading = false,
}) => {
  const [open, setOpen] = React.useState(false);

  const { data } = useGetServersStats();
  const servers = data ?? [];

  const {
    localFilters,
    setLocalFilters,
    handleServerChange,
    handleTariffChange,
    handleSelectAllTariffs,
    handleReset,
    getActiveFiltersCount,
    isPaidSelected,
    isFreeSelected,
    isAllTariffsSelected,
  } = useFilterPeers(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const activeCount = getActiveFiltersCount(filters);

  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size='icon' variant='outline' disabled={isLoading} className='relative'>
            <Filter className='w-4 h-4' />
            {activeCount > 0 && (
              <Badge className='absolute -top-2 text-secondary -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs'>
                {activeCount}
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
            <ServerFilter
              servers={servers}
              selectedServerIds={localFilters.serverIds}
              onServerChange={handleServerChange}
              onClear={() => setLocalFilters((prev) => ({ ...prev, serverIds: [] }))}
            />

            <TariffFilter
              isAllSelected={isAllTariffsSelected}
              isPaidSelected={isPaidSelected}
              isFreeSelected={isFreeSelected}
              onSelectAll={handleSelectAllTariffs}
              onTariffChange={handleTariffChange}
            />

            <ActiveFilters
              serverIds={localFilters.serverIds}
              servers={servers}
              isFree={localFilters.isFree}
            />
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
