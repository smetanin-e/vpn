import { PeerApiType } from '@/src/features/peer/api/create-peer-api';
import { normalizeWgConfig } from '../model/lib/normalize-config';

export async function getWgPeerConfig(
  peerApiInstance: PeerApiType,
  peerId: string,
): Promise<string | null> {
  try {
    const config = await peerApiInstance.downloadPeerConfig!(peerId);
    return normalizeWgConfig(config);
  } catch (error) {
    console.error('[getWgServerPeerConfig] Server error', error);
    return null;
  }
}
