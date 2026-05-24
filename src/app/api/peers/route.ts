import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { logger } from '@/src/shared/lib/logger';
import { parseServerIds } from '@/src/entities/peer/model/helpers/parse-server-ids';
import { parseIsFree } from '@/src/entities/peer/model/helpers/parse-is-free';

const VALID_SORT_FIELDS = ['balance', 'lastHandshake', 'sentBytes', 'createdAt'] as const;
const VALID_SORT_ORDERS = ['asc', 'desc'] as const;

type SortField = (typeof VALID_SORT_FIELDS)[number];
type SortOrder = (typeof VALID_SORT_ORDERS)[number];

export async function GET(req: NextRequest) {
  try {
    //  Проверка сессии пользователя — вместо статического токена
    const user = await getUserSession();
    if (!user) {
      throw new UnauthorizedError();
    }

    // Парсинг параметров
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search')?.trim() || '';
    const take = searchParams.get('take') ? parseInt(searchParams.get('take')!, 10) : undefined;
    const skip = searchParams.get('skip') ? parseInt(searchParams.get('skip')!, 10) : undefined;
    const serverIds = parseServerIds(searchParams.get('serverIds'));
    const isFree = parseIsFree(searchParams.get('isFree'));

    // Валидация sortField
    const rawSortField = searchParams.get('sortField') as SortField;
    const sortField = VALID_SORT_FIELDS.includes(rawSortField) ? rawSortField : 'sentBytes';

    // Валидация sortOrder
    const rawSortOrder = searchParams.get('sortOrder') as SortOrder;
    const sortOrder = VALID_SORT_ORDERS.includes(rawSortOrder) ? rawSortOrder : 'desc';

    // Параллельные запросы для производительности
    const [peers, total] = await Promise.all([
      peerRepository.getAllPeersFiltered({
        search,
        take,
        skip,
        sortField,
        sortOrder,
        serverIds,
        isFree,
      }),
      peerRepository.getTotalCountByFilters({ search, serverIds, isFree }),
    ]);

    return NextResponse.json({
      data: peers,
      total,
    });
  } catch (error) {
    logger.error(`[API_PEER_GET] Request failed`, error);
    return handleApiError(error);
  }
}
