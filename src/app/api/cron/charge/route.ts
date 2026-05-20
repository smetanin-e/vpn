import { dailyCharge } from '@/src/features/daily-charge-logs/model/service/daily-charge';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { UnauthorizedError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';
import { validateCronToken } from '@/src/shared/lib/validate-cron-token';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    logger.info(`[CRON] Daily charge request ${requestId} started`);
    // 🔐 Проверка токена
    if (!validateCronToken(req)) {
      logger.warn(`[CRON] Daily charge request ${requestId} - invalid token`);
      throw new UnauthorizedError('Недействительный токен доступа');
    }

    // Выполняем списание
    const result = await dailyCharge();

    logger.info(`[CRON] Daily charge request ${requestId} completed`, result);

    return NextResponse.json(result);
  } catch (error) {
    logger.error(`[CRON] Daily charge request ${requestId} failed`, error);
    return handleApiError(error);
  }
}
