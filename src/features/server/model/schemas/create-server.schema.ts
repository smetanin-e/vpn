import { ServerTypeEnum } from '@/src/shared/constants/server';
import { z } from 'zod';

export const createServerSchema = z.object({
  serverType: ServerTypeEnum.describe('Тип сервера'),
  serverName: z.string().min(2, { message: 'Введите название сервера' }),
  serverDescription: z.string().min(2, { message: 'Введите описание сервера' }),
  serverAddress: z.string().url({ message: 'Введите корректный URL' }),
  apiToken: z.string().min(6, { message: 'Введите корректный API ключ' }),
});

export type CreateServerType = z.infer<typeof createServerSchema>;
