'use client';
import React from 'react';
import { toast } from 'sonner';
import { logger } from './logger';

type ErrorHandlerOptions = {
  showToast?: boolean;
  logToConsole?: boolean;
};

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { showToast = true, logToConsole = true } = options;
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback(
    (error: unknown, customMessage?: string) => {
      // Логируем в консоль
      if (logToConsole) {
        logger.error('[Client Error]:', error);
      }

      // Определяем сообщение
      let message = customMessage || 'Произошла ошибка';

      if (error instanceof Error) {
        message = error.message;
      }

      // Показываем тост
      if (showToast) {
        toast.error(message);
      }

      setError(error instanceof Error ? error : new Error(message));
    },
    [showToast, logToConsole],
  );

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}
