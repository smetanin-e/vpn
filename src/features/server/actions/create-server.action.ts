'use server';

import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { CreateServerType } from '../model/schemas/create-server.schema';

export async function createServerAction(data: CreateServerType) {
  try {
    // Создаём пира на wg-rest-api
    const server = await serverRepository.create(data);
    if (!server) {
      return { success: false, message: 'Ошибка при создании сервере WG' };
    }

    return { success: true, message: 'Сервер успешно создан' };
  } catch (error) {
    console.error('[CREATE_SERVER] Server error', error);
    return { success: false, message: 'Ошибка создания сервера' };
  }
}
