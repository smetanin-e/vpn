import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchDailyCharges } from '../api/fetch-daily-charges';

export const useDailyCharges = () => {
  return useInfiniteQuery({
    queryKey: ['daily-charges'],
    queryFn: ({ pageParam = 0 }) => fetchDailyCharges({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
