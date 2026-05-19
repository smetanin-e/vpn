'use server';

import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { CreateServerType } from '../model/schemas/create-server.schema';
import { ValidationError } from '@/src/shared/lib/errors/app-error';
import { handleActionError } from '@/src/shared/lib/action-error-handler';
import { logger } from '@/src/shared/lib/logger';

export async function createServerAction(data: CreateServerType) {
  try {
    // Создаём пира на wg-rest-api
    const server = await serverRepository.create(data);
    if (!server) {
      throw new ValidationError('Ошибка при создании сервера');
    }

    return { success: true, message: 'Сервер успешно создан' };
  } catch (error) {
    logger.error(`[CREATE_SERVER] Server error`, error);
    return handleActionError(error);
  }
}
