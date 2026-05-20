import { clientAxiosInstance } from '@/src/shared/api/client';
import { ChargeLog } from '../model/types.type';

interface Params {
  pageParam?: number;
}

export const fetchDailyCharges = async ({
  pageParam = 0,
}: Params): Promise<{ charges: ChargeLog[]; nextPage: number | undefined; total: number }> => {
  const take = 5;
  const skip = pageParam * take;
  const params = new URLSearchParams();
  params.set('take', take.toString());
  params.set('skip', skip.toString());

  // ✅ Получаем и записи, и общее количество
  const { data } = await clientAxiosInstance.get<{
    data: ChargeLog[];
    total: number;
  }>(`/daily-charge-logs?${params.toString()}`);

  const { data: charges, total } = data;

  // ✅ Правильно определяем, есть ли следующая страница
  const hasMore = skip + take < total;

  return {
    charges,
    nextPage: hasMore ? pageParam + 1 : undefined,
    total,
  };
};
