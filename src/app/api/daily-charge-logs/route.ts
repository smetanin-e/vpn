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
      throw new UnauthorizedError('Доступ запрещен');
    }

    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get('take') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const [charges, total] = await Promise.all([
      prisma.dailyChargeLog.findMany({
        take,
        skip,
        orderBy: { date: 'desc' },
      }),
      prisma.dailyChargeLog.count(),
    ]);

    return NextResponse.json({
      data: charges,
      total,
    });
  } catch (error) {
    logger.error('[DAILY_CHARGE_LOGS] Failed', error);
    return handleApiError(error);
  }
}
