import { PeerQueryType } from '@/src/entities/peer/model/types';
import { clientAxiosInstance } from '@/src/shared/api/client';
import { NotFoundError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';

interface FetchPeersParams {
  pageParam?: number;
  search?: string;
  sortField: string;
  sortOrder: string;
  serverIds?: number[]; // ID выбранных серверов
  isFree?: boolean | null; // true - только бесплатные, false - только платные, null/undefined - все
}

export const fetchPeers = async ({
  pageParam = 0,
  search = '',
  sortField = 'lastActivity',
  sortOrder = 'desc',
  serverIds,
  isFree,
}: FetchPeersParams): Promise<{
  peers: PeerQueryType[];
  nextPage: number | undefined;
  total: number;
}> => {
  try {
    const take = 20;
    const skip = pageParam * take;
    const params = new URLSearchParams();

    params.set('take', take.toString());
    params.set('skip', skip.toString());
    params.set('sortField', sortField);
    params.set('sortOrder', sortOrder);
    if (search.trim()) params.set('search', search.trim());

    // Фильтрация по серверам (если есть выбранные)
    if (serverIds && serverIds.length > 0) {
      params.set('serverIds', JSON.stringify(serverIds));
    }

    //Фильтрация по типу доступа (если указан)
    if (isFree !== undefined && isFree !== null) {
      params.set('isFree', isFree.toString());
    }

    const { data } = await clientAxiosInstance.get<{ data: PeerQueryType[]; total: number }>(
      `/peers?${params.toString()}`,
    );

    if (!data) {
      throw new NotFoundError('Ошибка при загрузке пиров');
    }

    const { data: peers, total } = data;

    // Определяем, есть ли следующая страница
    const hasMore = skip + take < total;

    return {
      peers,
      nextPage: hasMore ? pageParam + 1 : undefined,
      total,
    };
  } catch (error) {
    logger.error('[fetchPeers] failed', error);
    throw error;
  }
};
