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
      throw new UnauthorizedError('Доступ только для администраторов');
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const [logs, total] = await Promise.all([
      prisma.dailyChargeLog.findMany({
        orderBy: { date: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.dailyChargeLog.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      meta: { total, limit, offset },
    });
  } catch (error) {
    logger.error('[DAILY_CHARGE_LOGS] Failed', error);
    return handleApiError(error);
  }
}
