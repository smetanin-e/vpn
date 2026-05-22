import React from 'react';
import { Menu } from './menu';
import { SyncTraffic } from '@/src/entities/peer/ui/sync-traffic';

interface Props {
  className?: string;
  title: string;
  name: string;
  userId: number;
  links: React.ReactNode;
}

export const Header: React.FC<Props> = ({ title, name, userId, links }) => {
  return (
    <div className='mb-4 flex items-center justify-end gap-6 md:mb-6 md:justify-between md:space-x-4'>
      <h1 className='mb-2 text-3xl font-bold md:text-left'>{title}</h1>

      <div className='flex items-center gap-4'>
        <SyncTraffic />
        <Menu userId={userId} name={name} links={links} />
      </div>
    </div>
  );
};
