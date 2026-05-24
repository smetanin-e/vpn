import { Prisma } from '@/generated/prisma/client';
import { SortField, SortOrder } from '../types/sort.types';
import { logger } from '@/src/shared/lib/logger';

const ORDER_BUILDERS: Record<SortField, (order: SortOrder) => Prisma.PeerOrderByWithRelationInput> =
  {
    sentBytes: (order) => ({ sentBytes: order }),
    lastHandshake: (order) => ({ lastHandshake: order }),
    createdAt: (order) => ({ createdAt: order }),
    balance: (order) => ({ client: { balance: order } }),
  };

export function buildPeerOrderBy(
  sortField: SortField = 'sentBytes',
  sortOrder: SortOrder = 'desc',
): Prisma.PeerOrderByWithRelationInput {
  const builder = ORDER_BUILDERS[sortField];

  if (!builder) {
    logger.warn(`[buildPeerOrderBy] Unknown sort field: ${sortField}, using default`);
    return { sentBytes: 'desc' };
  }
  return builder(sortOrder);
}
