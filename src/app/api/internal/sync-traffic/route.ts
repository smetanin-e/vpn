import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { logger } from '@/src/shared/lib/logger';
import { NextResponse } from 'next/server';

//При принудительной синхронизации
export async function POST() {
  try {
    await fetch(`${process.env.HOST}/api/cron/sync-traffic`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Трафик синхронизирован',
    });
  } catch (error) {
    logger.error('[[POST] API_INTERNAL_SYNC_TRASFFIC] sync error', error);
    return handleApiError(error);
  }
}
