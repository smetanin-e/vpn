import { transactionRepository } from '@/src/entities/transaction/repository/transaction-repository';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const take = searchParams.get('take') ? parseInt(searchParams.get('take')!, 10) : undefined;

    const skip = searchParams.get('skip')
      ? parseInt(searchParams.get('skip')!, 10) || 0
      : undefined;
    const clientId = searchParams.get('clientId')
      ? parseInt(searchParams.get('clientId')!, 10)
      : undefined;

    const transactions = await transactionRepository.getAll(search, take, skip, clientId);
    return NextResponse.json(transactions);
  } catch (error) {
    logger.error(`[API_GET_TRANSACTION] Request failed`, error);
    return handleApiError(error);
  }
}
