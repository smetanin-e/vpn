import { DeletePeer } from '@/src/features/peer/ui/delete-peer';
import { DownloadConf } from './download-conf';
import { Qr } from './qr';

type Props = {
  id: number;
  clientId: number;
};

export function PeerActions({ id, clientId }: Props) {
  return (
    <div className='flex w-full items-center justify-between gap-2 sm:justify-end'>
      <DownloadConf peerId={id} peerName={`vpn${clientId}`} />
      <Qr dbPeerId={id} peerName={`UID:${clientId}`} />
      <DeletePeer peerId={id} clientId={clientId} />
    </div>
  );
}
