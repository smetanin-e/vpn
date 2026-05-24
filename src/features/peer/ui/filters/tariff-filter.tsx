import { Checkbox, Label } from '@/src/shared/components/ui';
import React from 'react';

interface TariffFilterProps {
  isAllSelected: boolean;
  isPaidSelected: boolean;
  isFreeSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onTariffChange: (type: 'paid' | 'free', checked: boolean) => void;
}

export const TariffFilter: React.FC<TariffFilterProps> = ({
  isAllSelected,
  isPaidSelected,
  isFreeSelected,
  onSelectAll,
  onTariffChange,
}) => {
  return (
    <div className='space-y-3'>
      <Label className='text-base font-semibold text-white'>Тип доступа</Label>
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <Checkbox id='tariff-all' checked={isAllSelected} onCheckedChange={onSelectAll} />
          <Label htmlFor='tariff-all' className='cursor-pointer text-sm font-normal text-slate-200'>
            Все типы
          </Label>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='tariff-paid'
            checked={isPaidSelected}
            onCheckedChange={(checked) => onTariffChange('paid', checked as boolean)}
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
            onCheckedChange={(checked) => onTariffChange('free', checked as boolean)}
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
  );
};
