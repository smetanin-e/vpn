import { clientAxiosInstance } from '@/src/shared/api/client';
import { TransactionDTO } from '../model/types';

interface FetchTransactionsParams {
  pageParam?: number;
  search?: string;
  clientId?: number;
}

export const fetchTransactions = async ({
  pageParam = 0,
  search = '',
  clientId,
}: FetchTransactionsParams): Promise<{
  transactions: TransactionDTO[];
  nextPage: number | undefined;
  total: number;
}> => {
  const take = 5;
  const skip = pageParam * take;
  const params = new URLSearchParams();
  params.set('take', take.toString());
  params.set('skip', skip.toString());
  if (search.trim()) params.set('search', search.trim());
  if (clientId) params.set('clientId', clientId.toString());

  const { data } = await clientAxiosInstance.get<{ data: TransactionDTO[]; total: number }>(
    `/transactions?${params.toString()}`,
  );

  const { data: transactions, total } = data;

  //определяем, есть ли следующая страница
  const hasMore = skip + take < total;
  return {
    transactions,
    nextPage: hasMore ? pageParam + 1 : undefined,
    total,
  };
};
