import { logger } from '@/src/shared/lib/logger';

type ApiError = {
  message?: string;
  response?: {
    data?: {
      error?: string;
    };
  };
};

export function isPeerNotFoundError(error: unknown): boolean {
  const apiError = error as ApiError;
  const errorMessage = apiError?.message || '';
  const apiErrorMsg = apiError?.response?.data?.error || '';

  return (
    errorMessage.includes('The requested config was not found on the server') ||
    apiErrorMsg === 'The requested config was not found on the server'
  );
}

export function handlePeerApiError(
  error: unknown,
  context: { peerId: number; externalId: string },
): boolean {
  if (isPeerNotFoundError(error)) {
    logger.warn(`[DELETE_PEER] Пир уже отсутствует на сервере`, context);
    return true; // обработали, можно продолжать
  }

  logger.error(`[DELETE_PEER] Ошибка при удалении с сервера`, {
    ...context,
    error: error instanceof Error ? error.message : 'Unknown',
  });
  return false; // нужно пробросить дальше
}
