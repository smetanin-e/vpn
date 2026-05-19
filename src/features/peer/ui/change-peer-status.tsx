'use client';

import { PeerStatus } from '@/generated/prisma/enums';
import { Switch } from '@/src/shared/components/ui';

import React from 'react';
import { usePeerMutations } from '../model/hooks/use-peer-mutations';
import { cn } from '@/src/shared/lib/utils';
import { logger } from '@/src/shared/lib/logger';

interface Props {
  className?: string;
  id: number;
  status: PeerStatus;
}

export const ChangePeerStatus: React.FC<Props> = ({ id, status }) => {
  const { togglePeerStatus } = usePeerMutations();
  const handleToggle = async (id: number) => {
    try {
      await togglePeerStatus.mutateAsync(id);
    } catch (error) {
      logger.error(`[ChangePeerStatus] Failed to toggle peer status`, error);
    }
  };
  return (
    <Switch
      disabled={togglePeerStatus.isLoading}
      checked={status === PeerStatus.ACTIVE}
      onCheckedChange={() => handleToggle(id)}
      className={cn('data-[state=checked]:bg-teal-500', 'data-[state=unchecked]:bg-gray-400')}
    />
  );
};
