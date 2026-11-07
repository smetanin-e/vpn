export interface FiltersState {
  serverIds: number[];
  isFree: boolean | null;
  deactivated: boolean | null;
}

export interface FilterPeersModalProps {
  className?: string;
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  isLoading?: boolean;
}
