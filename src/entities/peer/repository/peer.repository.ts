import { PeerStatus, Prisma } from '@/generated/prisma/client';
import { prisma } from '@/src/shared/lib/prisma';
import { SortField, SortOrder } from '../ui/peer-sort';
import { PeerQueryType } from '../model/types';
import { convertPeer } from '../model/lib/convert-peer';

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
};

type OrderBy = {
  sentBytes?: SortOrder;
  lastHandshake?: SortOrder;
  client?: { balance: SortOrder };
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
  async getAllPeersFiltered(
    search: string,
    take?: number,
    skip?: number,
    sortField: SortField = 'lastHandshake',
    sortOrder: SortOrder = 'desc',
  ): Promise<PeerQueryType[]> {
    let orderBy: OrderBy = {};
    switch (sortField) {
      case 'sentBytes':
        orderBy = { sentBytes: sortOrder };
        break;
      case 'lastHandshake':
        orderBy = { lastHandshake: sortOrder };
        break;
      case 'balance':
        // Для сортировки по balance нужно сортировать связанную таблицу client
        // Это потребует использования include или orderBy с relation
        orderBy = { client: { balance: sortOrder } };
        break;
      default:
        orderBy = { sentBytes: 'desc' };
    }

    const where: Prisma.PeerWhereInput = {};
    if (search) {
      const orConditions: Prisma.PeerWhereInput[] = [
        {
          client: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },

        {
          client: {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
      // Добавляем поиск по clientId, если search является числом
      const numericSearch = Number(search);
      if (!Number.isNaN(numericSearch)) {
        orConditions.unshift({ clientId: numericSearch });
      }
      where.OR = orConditions;
    }

    const peers = await prisma.peer.findMany({
      where,
      select: basePeerSelect,
      orderBy,
      take,
      skip,
    });

    // Конвертируем все записи
    return peers.map(convertPeer);
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

  //Удаляем пир
  async deletePeer(peerId: number) {
    return prisma.peer.delete({
      where: { id: peerId },
    });
  },
};
