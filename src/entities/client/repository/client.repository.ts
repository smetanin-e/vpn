import { PeerStatus } from '@/generated/prisma/enums';
import { prisma } from '@/src/shared/lib/prisma';
import { ClientDTO } from '../model/types';
import { logger } from '@/src/shared/lib/logger';

export const clientRepository = {
  async createClient(name: string, description: string, tariff: number) {
    return prisma.client.create({
      data: {
        name,
        description,
        tariff,
      },
    });
  },

  async findClientById(clientId: number) {
    return prisma.client.findFirst({
      where: { id: clientId },
    });
  },

  async findClienWithRelations(clientId: number) {
    return prisma.client.findFirst({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        description: true,
        tariff: true,
        balance: true,
        peer: {
          select: {
            id: true,
            externalId: true,
            status: true,
            server: true,
          },
        },
      },
    });
  },

  async findClientsForPayment(): Promise<ClientDTO[]> {
    try {
      const clients = await prisma.client.findMany({
        where: {
          isFree: false,
        },
        include: {
          peer: {
            where: { status: PeerStatus.ACTIVE },
            select: {
              id: true,
              externalId: true,
              status: true,
              server: true,
            },
          },
        },
      });

      logger.debug(`[CLIENT_REPO] Found ${clients.length} clients for payment`);
      return clients;
    } catch (error) {
      logger.error('[CLIENT_REPO] Failed to fetch clients for payment', error);
      throw error;
    }
  },

  async deleteClient(clientId: number) {
    return prisma.client.delete({
      where: { id: clientId },
    });
  },

  async updateFreeMode(clientId: number, isFree: boolean) {
    return prisma.client.update({
      where: { id: clientId },
      data: { isFree: isFree },
    });
  },

  async updateBalance(clientId: number, newBalance: number) {
    return prisma.client.update({
      where: { id: clientId },
      data: { balance: newBalance },
    });
  },
  async findByTokenId(accessTokenId: string) {
    return prisma.client.findUnique({
      where: { accessTokenId },
      select: {
        accessTokenHash: true,
        balance: true,
        id: true,
        tariff: true,
        isFree: true,
        peer: { select: { status: true, server: { select: { type: true } } } },
      },
    });
  },

  async updateToken(clientId: number, accessTokenId: string, accessTokenHash: string) {
    return prisma.client.update({
      where: { id: clientId },
      data: {
        accessTokenId,
        accessTokenHash,
      },
    });
  },
};
