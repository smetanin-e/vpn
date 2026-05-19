import { PeerApiType } from '@/src/features/peer/api/create-peer-api';
import { normalizeWgConfig } from '../model/lib/normalize-config';
import { logger } from '@/src/shared/lib/logger';

export async function getWgPeerConfig(
  peerApiInstance: PeerApiType,
  peerId: string,
): Promise<string | null> {
  try {
    const config = await peerApiInstance.downloadPeerConfig!(peerId);
    return normalizeWgConfig(config);
  } catch (error) {
    logger.error('[getWgServerPeerConfig] Server error', error);

    return null;
  }
}
