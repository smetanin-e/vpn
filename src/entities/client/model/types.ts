import { ServerType } from '@/generated/prisma/enums';

export type ClientDTO = {
  id: number;
  name: string;
  description: string;
  tariff: number;
  peer: {
    id: number;
    wgPeerId: number;
    server: {
      name: string;
      type: ServerType;
    };
  };
};
