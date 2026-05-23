import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/src/shared/lib/prisma';

export async function getTotalCountByFilters({
  search,
  serverIds,
  isFree,
}: {
  search: string;
  serverIds?: number[];
  isFree?: boolean;
}) {
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

    const numericSearch = Number(search);
    if (!Number.isNaN(numericSearch)) {
      orConditions.unshift({ clientId: numericSearch });
    }
    where.OR = orConditions;
  }

  if (serverIds && serverIds.length > 0) {
    where.serverId = {
      in: serverIds,
    };
  }

  if (isFree !== undefined) {
    where.client = {
      isFree: isFree,
    };
  }

  return prisma.peer.count({ where });
}
