/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from 'next/server';
import { AppError } from './errors/app-error';
import { isAxiosError } from 'axios';
import { logger } from './logger';

type ErrorResponse = {
  error: string;
  code?: string;
  details?: unknown;
};

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  //Логируем ошибку

  logger.error(`[API Error]:`, error);
  //Если ошибка кастомная
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      {
        status: error.statusCode,
      },
    );
  }

  //Ошибка валидации PRISMA
  if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
    // @ts-expect-error
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: 'Запись с такими данными уже существует',
          code: 'DUPLICATE_ERROR',
        },
        {
          status: 409,
        },
      );
    }
    // @ts-expect-error
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          error: 'Запись не найдена',
          code: 'NOT_FOUND',
        },
        { status: 404 },
      );
    }
  }

  // Axios ошибка (запрос к внешнему API)
  if (isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data.message || error.message;

    return NextResponse.json(
      {
        error: `Внешний API вернул ошибку: ${message}`,
        code: 'EXTERNAL_API_ERROR',
      },
      { status },
    );
  }

  //Неизвестная ошибка
  return NextResponse.json(
    {
      error: 'Внутренняя ошибка сервера',
      code: 'INTERNAL_SERVER_ERROR',
    },
    { status: 500 },
  );
}

// // Type guard для Axios ошибки
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function isAxiosError(error: unknown): error is any {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return (error as any)?.isAxiosError === true;
// }
