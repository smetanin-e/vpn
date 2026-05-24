import React from 'react';
import { FiltersState } from '../types/filter-peers.types';

export function useFilterPeers(initialFilters: FiltersState) {
  const [localFilters, setLocalFilters] = React.useState<FiltersState>(initialFilters);

  const handleServerChange = (serverId: number, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      serverIds: checked
        ? [...prev.serverIds, serverId]
        : prev.serverIds.filter((id) => id !== serverId),
    }));
  };

  const handleTariffChange = (type: 'paid' | 'free', checked: boolean) => {
    if (type === 'paid') {
      setLocalFilters((prev) => ({
        ...prev,
        isFree: checked ? false : prev.isFree === true ? true : null,
      }));
    } else {
      setLocalFilters((prev) => ({
        ...prev,
        isFree: checked ? true : prev.isFree === false ? false : null,
      }));
    }
  };

  const handleSelectAllTariffs = (checked: boolean) => {
    if (checked) {
      setLocalFilters((prev) => ({ ...prev, isFree: null }));
    }
  };

  const handleReset = () => {
    setLocalFilters({
      serverIds: [],
      isFree: null,
    });
  };

  const getActiveFiltersCount = (filters: FiltersState) => {
    let count = 0;
    if (filters.serverIds.length > 0) count++;
    if (filters.isFree !== null) count++;
    return count;
  };

  const isPaidSelected = localFilters.isFree === false;
  const isFreeSelected = localFilters.isFree === true;
  const isAllTariffsSelected = localFilters.isFree === null;

  return {
    localFilters,
    setLocalFilters,
    handleServerChange,
    handleTariffChange,
    handleSelectAllTariffs,
    handleReset,
    getActiveFiltersCount,
    isPaidSelected,
    isFreeSelected,
    isAllTariffsSelected,
  };
}
