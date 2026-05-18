import { FormSelectType } from '@/src/shared/components/form/form-select';

export const transformToSelectOptions = (
  servers: Array<{ id: number; name: string }>,
): FormSelectType[] =>
  servers.map(({ id, name }) => ({
    label: name,
    value: String(id),
  }));
