import { PeerQueryType, PeerQueryTypeWithBigInt } from '../types';

export function convertPeer(peer: PeerQueryTypeWithBigInt): PeerQueryType {
  return {
    id: peer.id,
    externalId: peer.externalId,
    name: peer.name,
    status: peer.status,
    receivedBytes: Number(peer.receivedBytes), // BigInt -> number
    sentBytes: Number(peer.sentBytes), // BigInt -> number
    lastHandshake: peer.lastHandshake,
    client: peer.client,
    server: peer.server,
    config: peer.config,
  };
}
