export type SortField = 'balance' | 'lastHandshake' | 'sentBytes' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export const SORT_LABELS: Record<SortField, string> = {
  balance: 'Баланс',
  lastHandshake: 'Последняя активность',
  sentBytes: 'Использованно трафика',
  createdAt: 'Дата создания',
} as const;
