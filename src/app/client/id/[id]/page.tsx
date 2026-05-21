import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { ClientCard } from '@/src/entities/client/ui/client-card';
import { ClientLink } from '@/src/entities/client/ui/client-link';
import { СlientNotFound } from '@/src/entities/client/ui/client-not-found';
import { Logo } from '@/src/shared/components';
import { Button } from '@/src/shared/components/ui';
import { Transactions } from '@/src/widgets/transactions/transactions';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function PeerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await clientRepository.findClienWithRelations(Number(id));

  if (!client) {
    //TODO ДОБАВИТЬ NOTFOUND PAGE
    return <СlientNotFound />;
  }

  return (
    <div className='flex min-h-screen flex-col gap-4 bg-linear-to-br from-slate-900 via-blue-900 to-slate-900'>
      <div className='flex items-center justify-center gap-2 rounded px-2 pt-4'>
        <Logo width={25} height={25} type={client.peer!.server!.type} />

        <span className='text-lg text-muted-foreground'>Client ID: </span>
        <code className='truncate font-mono text-lg'>{client.id}</code>
      </div>
      <div className='mx-2 flex justify-between'>
        <Link href={'/dashboard'}>
          {' '}
          <Button variant='outline' size='sm'>
            <ArrowLeft className='h-4 w-4' />
            Назад
          </Button>
        </Link>

        <ClientLink id={client.id} tokenId={!!client.accessTokenId} />
      </div>

      <ClientCard id={client.peer!.id} />
      {/* Статистика трафика */}
      {/* <MonthlyStats peerId={peer.id} />*/}
      <Transactions clientId={client.id} />
    </div>
  );
}
