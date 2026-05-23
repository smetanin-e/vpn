import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '@reactuses/core';
import React from 'react';

import { SortField, SortOrder } from '../../ui/peer-sort';
import { fetchPeers } from '@/src/features/peer/api/fetch-peers';

export const useGetPeers = (
  search?: string,
  sortField: SortField = 'sentBytes',
  sortOrder: SortOrder = 'desc',
  serverIds?: number[],
  isFree?: boolean | null,
) => {
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);

  // Делаем debounce на входной строке
  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    1000,
    [search],
  );
  return useInfiniteQuery({
    queryKey: ['peers', debouncedSearch, sortField, sortOrder, serverIds, isFree],
    queryFn: ({ pageParam = 0 }) =>
      fetchPeers({ pageParam, search: debouncedSearch, sortField, sortOrder, serverIds, isFree }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
