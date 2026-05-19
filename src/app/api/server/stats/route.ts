import { NextResponse } from 'next/server';

import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { transformServerStats } from '@/src/entities/server/model/libs/transform-server-stats';
import { NotFoundError, UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';
import { handleApiError } from '@/src/shared/lib/api-error-handler';

export async function GET() {
  try {
    const user = await getUserSession();
    if (!user) {
      throw new UnauthorizedError();
    }

    const servers = await serverRepository.getForStats();

    if (!servers) {
      throw new NotFoundError('Сервера не найден');
    }

    const stats = transformServerStats(servers);

    return NextResponse.json(stats);
  } catch (error) {
    logger.error(`[API_STATS_GET] Request failed`, error);
    return handleApiError(error);
  }
}
