'use client';

import { Switch } from '@/src/shared/components/ui';

import React from 'react';

import { cn } from '@/src/shared/lib/utils';
import { useClientMutations } from '../../client/model/hooks/use-client-mutations';

interface Props {
  className?: string;
  id: number;
  isFree: boolean;
}

export const ChangeFreeMode: React.FC<Props> = ({ id, isFree }) => {
  const { toggleFreeMode } = useClientMutations();
  const handleToggle = async (id: number) => {
    try {
      await toggleFreeMode.mutateAsync(id);
    } catch (error) {
      console.error('Failed to toggle free mode', error);
    }
  };
  return (
    <Switch
      disabled={toggleFreeMode.isLoading}
      checked={isFree}
      onCheckedChange={() => handleToggle(id)}
      className={cn('data-[state=checked]:bg-teal-500', 'data-[state=unchecked]:bg-gray-400')}
    />
  );
};
