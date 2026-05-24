import { Client, PeerStatus, Server } from '@/generated/prisma/client';

export type PeerQueryType = {
  id: number;
  externalId: string;
  name: string;
  config: string | null;
  status: PeerStatus;
  receivedBytes: number;
  sentBytes: number;
  lastHandshake: Date | null;
  client: Pick<
    Client,
    'id' | 'name' | 'description' | 'isFree' | 'balance' | 'tariff' | 'accessTokenId'
  >;
  server: Pick<Server, 'name' | 'type'> | null;
};

export type PeerQueryTypeWithBigInt = Omit<PeerQueryType, 'receivedBytes' | 'sentBytes'> & {
  receivedBytes: bigint;
  sentBytes: bigint;
};

export interface WireguardServerPeer {
  id: number;
  server_public_key: string;
  address: string;
  address_ipv6: string;
  private_key: string;
  public_key: string;
  preshared_key: string;
  enable: boolean;
  allowed_ips: string;
  dns: string | null;
  persistent_keepalive: number;
  endpoint: string;
  last_online: string | Date | null;
  traffic: {
    received: number;
    sent: number;
  } | null;
  data: {
    name: string;
  };
}

export type TrafficData = {
  externalId: string;
  traffic: { received: number; sent: number };
  lastHandshake: Date | null;
};
