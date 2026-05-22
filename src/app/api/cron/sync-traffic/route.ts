import { syncTraffic } from '@/src/features/peer/model/service/sync-traffic';
import { serverAxiosInstance } from '@/src/shared/api/server';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';
import { validateCronToken } from '@/src/shared/lib/validate-cron-token';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // 🔐 Проверка токена
    if (!validateCronToken(req)) {
      throw new UnauthorizedError();
    }

    await syncTraffic();
    return NextResponse.json({
      success: true,
      message: 'Трафик синхронизирован',
    });
  } catch (error) {
    logger.error('[[GET] API_CRON_SYNC_TRASFFIC] sync error', error);
    return handleApiError(error);
  }
}

//При принудительной синхронизации
export async function POST() {
  try {
    await serverAxiosInstance.get('/api/cron/sync-traffic', {
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Трафик синхронизирован',
    });
  } catch (error) {
    logger.error('[[POST] API_CRON_SYNC_TRASFFIC] sync error', error);
    return handleApiError(error);
  }
}
