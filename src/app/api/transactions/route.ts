import { transactionRepository } from '@/src/entities/transaction/repository/transaction-repository';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';
import { prisma } from '@/src/shared/lib/prisma';

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

    //const transactions = await transactionRepository.getAll(search, take, skip, clientId);

    const [transactions, total] = await Promise.all([
      await transactionRepository.getAll(search, take, skip, clientId),
      prisma.balanceTransaction.count({ where: { clientId } }),
    ]);
    return NextResponse.json({
      data: transactions,
      total,
    });
  } catch (error) {
    logger.error(`[API_GET_TRANSACTION] Request failed`, error);
    return handleApiError(error);
  }
}
