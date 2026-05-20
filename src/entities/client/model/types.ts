import { Client, Peer, Server } from '@/generated/prisma/client';
import { PeerStatus, ServerType } from '@/generated/prisma/enums';

export type ClientQueryType = Omit<Client, 'accessTokenHash'> & {
  peer:
    | (Peer & {
        server: Pick<Server, 'name' | 'type'> | null;
      })
    | null;
};

export type ClientDTO = {
  id: number;
  name: string;
  description: string;
  balance: number;
  isFree: boolean;
  tariff: number;
  createdAt: Date;
  accessTokenId: string | null;
  accessTokenHash: string | null;

  peer: {
    id: number;
    externalId: string;
    status: PeerStatus;

    server: {
      id: number;
      name: string;
      type: ServerType;
      description: string;
      baseUrl: string;
      apiToken: string;
    } | null;
  } | null;
};
