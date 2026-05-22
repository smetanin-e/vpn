import { Button } from '@/src/shared/components/ui';
import { ArrowLeft, SearchAlert } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface Props {
  className?: string;
}

export const СlientNotFound: React.FC<Props> = () => {
  return (
    <div className='flex min-h-screen flex-col bg-linear-to-br from-slate-900 via-blue-900 to-slate-900'>
      <div className='m-2'>
        <Link href={'/dashboard'}>
          {' '}
          <Button variant='outline' size='sm'>
            <ArrowLeft className='h-4 w-4' />
            На главную
          </Button>
        </Link>
      </div>
      <div className='flex grow flex-col items-center justify-center'>
        <SearchAlert className='w-50 h-50' />

        <p className='text-l mb-8 max-w-xl p-2 text-center text-gray-300'>
          Такого клиента больше не существует
        </p>
      </div>
    </div>
  );
};
