import { Checkbox, Label } from '@/src/shared/components/ui';
import React from 'react';

interface StatusFilterProps {
  isAllSelected: boolean;
  isActiveSelected: boolean;
  isInactiveSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onStatusChange: (type: 'ACTIVE' | 'INACTIVE', checked: boolean) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  isAllSelected,
  isActiveSelected,
  isInactiveSelected,
  onSelectAll,
  onStatusChange,
}) => {
  return (
    <div className='space-y-3'>
      <Label className='text-base font-semibold text-white'>Статус</Label>
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <Checkbox id='tariff-all' checked={isAllSelected} onCheckedChange={onSelectAll} />
          <Label htmlFor='tariff-all' className='cursor-pointer text-sm font-normal text-slate-200'>
            Все статусы
          </Label>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='status-active'
            checked={isActiveSelected}
            onCheckedChange={(checked) => onStatusChange('ACTIVE', checked as boolean)}
          />
          <Label
            htmlFor='status-active'
            className='cursor-pointer text-sm font-normal text-slate-200'
          >
            Активные
          </Label>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='status-inactive'
            checked={isInactiveSelected}
            onCheckedChange={(checked) => onStatusChange('INACTIVE', checked as boolean)}
          />
          <Label
            htmlFor='status-inactive'
            className='cursor-pointer text-sm font-normal text-slate-200'
          >
            Отключенные
          </Label>
        </div>
      </div>
    </div>
  );
};
