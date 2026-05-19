import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getUserSession();
    if (!user) {
      throw new UnauthorizedError();
    }
    const servers = await serverRepository.getAll();
    return NextResponse.json(servers);
  } catch (error) {
    logger.error(`[API_SERVER_GET] Request failed`, error);
    return handleApiError(error);
  }
}
