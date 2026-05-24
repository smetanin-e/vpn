export function parseServerIds(param: string | null): number[] | undefined {
  if (!param) return undefined;

  try {
    const parsed = JSON.parse(param);

    if (Array.isArray(parsed)) return parsed;
  } catch {
    const singleId = parseInt(param, 10);
    if (!isNaN(singleId)) return [singleId];
  }

  return undefined;
}
