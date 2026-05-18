import { CreateServerType } from '@/src/features/server/model/schemas/create-server.schema';
import { prisma } from '@/src/shared/lib/prisma';

export const serverRepository = {
  async getAll() {
    return prisma.server.findMany();
  },

  async getForStats() {
    return prisma.server.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        peers: { select: { id: true, status: true } },
      },
    });
  },

  async findById(id: number) {
    return prisma.server.findUnique({
      where: { id },
    });
  },

  async create(data: CreateServerType) {
    return prisma.server.create({
      data: {
        type: data.serverType,
        name: data.serverName,
        description: data.serverDescription,
        baseUrl: data.serverAddress,
        apiToken: data.apiToken,
      },
    });
  },
};
