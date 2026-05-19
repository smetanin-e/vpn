/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { redirect } from 'next/navigation';
import { AppError, UnauthorizedError } from './errors/app-error';

type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

export async function handleActionError<T>(
  error: unknown,
  redirectOnUnauthorized: boolean = true,
): Promise<ActionResult<T>> {
  // Логируем ошибку
  console.error('[Action Error]:', error);

  //Если ошибка кастомная
  if (error instanceof AppError) {
    // Если не авторизован и нужно редиректить
    if (error instanceof UnauthorizedError && redirectOnUnauthorized) {
      redirect('/auth/login');
    }

    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  // Ошибка Prisma
  if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
    // @ts-ignore
    if (error.code === 'P2002') {
      return {
        success: false,
        error: 'Запись с такими данными уже существует',
        code: 'DUPLICATE_ERROR',
      };
    }
  }

  // Неизвестная ошибка
  return {
    success: false,
    error: 'Произошла ошибка при выполнении операции',
    code: 'UNKNOWN_ERROR',
  };
}
