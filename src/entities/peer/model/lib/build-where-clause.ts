import { Prisma } from '@/generated/prisma/client';

type BuildWhereClauseParams = {
  search?: string;
  serverIds?: number[];
  isFree?: boolean;
};

export function buildPeerWhereClause({
  search,
  serverIds,
  isFree,
}: BuildWhereClauseParams): Prisma.PeerWhereInput {
  const where: Prisma.PeerWhereInput = {};

  if (search) {
    const orConditions: Prisma.PeerWhereInput[] = [
      { client: { name: { contains: search, mode: 'insensitive' } } },
      { client: { description: { contains: search, mode: 'insensitive' } } },
    ];

    const numericSearch = Number(search);
    if (!Number.isNaN(numericSearch)) {
      orConditions.unshift({ clientId: numericSearch });
    }
    where.OR = orConditions;
  }

  // Фильтр по серверам
  if (serverIds?.length) {
    where.serverId = { in: serverIds };
  }

  // Фильтр по статусу тарифа
  if (isFree !== undefined) {
    where.client = { isFree };
  }

  return where;
}
