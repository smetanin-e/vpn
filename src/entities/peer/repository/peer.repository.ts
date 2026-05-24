import { PeerStatus } from '@/generated/prisma/client';
import { prisma } from '@/src/shared/lib/prisma';

import { PeerQueryType } from '../model/types/types';
import { convertPeer } from '../model/lib/convert-peer';
import { buildPeerWhereClause } from '../model/lib/build-where-clause';
import { buildPeerOrderBy } from '../model/lib/build-order-by';
import { SortField, SortOrder } from '../model/types/sort.types';

const basePeerSelect = {
  id: true,
  name: true,
  externalId: true,
  status: true,
  config: true,
  receivedBytes: true,
  sentBytes: true,
  lastHandshake: true,
  server: {
    select: {
      name: true,
      type: true,
    },
  },
  client: {
    select: {
      id: true,
      name: true,
      description: true,
      balance: true,
      isFree: true,
      tariff: true,
      accessTokenId: true,
    },
  },
} as const;

interface GetAllPeersFilteredParams {
  search?: string;
  take?: number;
  skip?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
  serverIds?: number[];
  isFree?: boolean; // true - бесплатные, false - платные, undefined - все
}

type CountFiltersParams = {
  search?: string;
  serverIds?: number[];
  isFree?: boolean;
};

export const peerRepository = {
  async createPeerDb(
    clientId: number,
    serverId: number,
    externalId: string,
    name: string,
    config?: string,
  ) {
    return prisma.peer.create({
      data: {
        clientId,
        serverId,
        externalId,
        name,
        config,
      },
    });
  },
  async getAllPeersFiltered(params: GetAllPeersFilteredParams): Promise<PeerQueryType[]> {
    const {
      search = '',
      take,
      skip,
      sortField = 'lastHandshake',
      sortOrder = 'desc',
      serverIds,
      isFree,
    } = params;

    const peers = await prisma.peer.findMany({
      where: buildPeerWhereClause({ search, serverIds, isFree }),
      select: basePeerSelect,
      orderBy: buildPeerOrderBy(sortField, sortOrder),
      take,
      skip,
    });

    // Конвертируем все записи
    return peers.map(convertPeer);
  },

  async getTotalCountByFilters(params: CountFiltersParams): Promise<number> {
    return prisma.peer.count({
      where: buildPeerWhereClause(params),
    });
  },

  // Поиск пира по id из БД c клиентом и сервером
  async findPeerByIdWithRelations(peerId: number): Promise<PeerQueryType | null> {
    const peer = await prisma.peer.findUnique({
      where: { id: peerId },
      select: basePeerSelect,
    });

    if (!peer) return null;
    return convertPeer(peer);
  },

  // Поиск пира по id из БД
  async findPeerById(peerId: number) {
    return prisma.peer.findFirst({
      where: { id: peerId },
      include: {
        server: true,
      },
    });
  },

  async findIdByClientId(clientId: number) {
    const peer = await prisma.peer.findFirst({
      where: { clientId },
    });

    return peer?.id;
  },

  // обновление статуса пира по id
  async updatePeerStatus(peerId: number, value: boolean) {
    const status = value ? PeerStatus.ACTIVE : PeerStatus.INACTIVE;
    return prisma.peer.update({
      where: { id: peerId },
      data: {
        status,
      },
    });
  },

  //Удаляем пир
  async deletePeer(peerId: number) {
    return prisma.peer.delete({
      where: { id: peerId },
    });
  },
};
