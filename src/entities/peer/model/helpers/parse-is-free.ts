export function parseIsFree(param: string | null): boolean | undefined {
  if (param === null) return undefined;
  return param === 'true';
}
