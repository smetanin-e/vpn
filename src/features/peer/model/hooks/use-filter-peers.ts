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

  const handleStatusChange = (type: 'ACTIVE' | 'INACTIVE', checked: boolean) => {
    if (type === 'ACTIVE') {
      setLocalFilters((prev) => ({
        ...prev,
        deactivated: checked ? false : prev.deactivated === true ? true : null,
      }));
    } else {
      setLocalFilters((prev) => ({
        ...prev,
        deactivated: checked ? true : prev.deactivated === false ? false : null,
      }));
    }
  };

  const handleSelectAllStatuses = (checked: boolean) => {
    if (checked) {
      setLocalFilters((prev) => ({ ...prev, deactivated: null }));
    }
  };

  const handleReset = () => {
    setLocalFilters({
      serverIds: [],
      isFree: null,
      deactivated: null,
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
  const isActiveSelected = localFilters.deactivated === false;
  const isInactiveSelected = localFilters.deactivated === true;
  const isAllStatusSelected = localFilters.deactivated === null;

  return {
    localFilters,
    setLocalFilters,
    handleServerChange,
    handleTariffChange,
    handleSelectAllTariffs,
    handleStatusChange,
    handleSelectAllStatuses,
    handleReset,
    getActiveFiltersCount,
    isPaidSelected,
    isFreeSelected,
    isAllTariffsSelected,
    isActiveSelected,
    isInactiveSelected,
    isAllStatusSelected,
  };
}
