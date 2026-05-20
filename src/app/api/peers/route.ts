import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { logger } from '@/src/shared/lib/logger';

type SortField = 'balance' | 'lastHandshake' | 'sentBytes' | 'created';
type SortOrder = 'asc' | 'desc';

export async function GET(req: NextRequest) {
  try {
    // 1. Проверка сессии пользователя — вместо статического токена
    const user = await getUserSession();
    if (!user) {
      throw new UnauthorizedError();
    }

    // 2. Парсинг параметров
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search')?.trim() || '';
    const take = searchParams.get('take') ? parseInt(searchParams.get('take')!, 10) : undefined;
    const skip = searchParams.get('skip') ? parseInt(searchParams.get('skip')!, 10) : undefined;

    // Валидация sortField
    let sortField: SortField = 'sentBytes';
    const rawSortField = searchParams.get('sortField');
    if (
      rawSortField === 'balance' ||
      rawSortField === 'lastHandshake' ||
      rawSortField === 'sentBytes' ||
      rawSortField === 'created'
    ) {
      sortField = rawSortField;
    }

    // Валидация sortOrder
    let sortOrder: SortOrder = 'desc';
    const rawSortOrder = searchParams.get('sortOrder');
    if (rawSortOrder === 'asc' || rawSortOrder === 'desc') {
      sortOrder = rawSortOrder;
    }

    const peers = await peerRepository.getAllPeersFiltered(
      search,
      take,
      skip,
      sortField,
      sortOrder,
    );
    return NextResponse.json(peers);
  } catch (error) {
    logger.error(`[API_PEER_GET] Request failed`, error);
    return handleApiError(error);
  }
}
