'use client';

import React from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SORT_LABELS, SortField, SortOrder } from '../model/types/sort.types';

interface PeerSortProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField, order: SortOrder) => void;
}

export const PeerSort: React.FC<PeerSortProps> = ({
  sortField = 'sentBytes', // добавлено значение по умолчанию
  sortOrder = 'desc',
  onSort,
}) => {
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Если сортируем по тому же полю, меняем порядок
      onSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Новое поле - по умолчанию desc
      onSort(field, 'desc');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size={'icon'}>
          <ArrowUpDown className='h-3.5 w-3.5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-75'>
        {Object.entries(SORT_LABELS).map(([field, label]) => (
          <DropdownMenuItem
            key={field}
            onClick={() => handleSort(field as SortField)}
            className='flex justify-between'
          >
            {label}
            {sortField === field &&
              (sortOrder === 'asc' ? (
                <ArrowUp className='h-4 w-4' />
              ) : (
                <ArrowDown className='h-4 w-4' />
              ))}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
