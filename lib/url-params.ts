export function decodeParam(value: string): string {
  let current = value.trim();
  if (!current) return current;

  for (let i = 0; i < 5; i++) {
    try {
      const next = decodeURIComponent(current.replace(/\+/g, " "));
      if (next === current) break;
      current = next;
    } catch {
      break;
    }
  }

  return current;
}

export function encodePathSegment(value: string): string {
  return encodeURIComponent(decodeParam(value));
}

export function buildQueryString(params: Record<string, string | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    search.set(key, decodeParam(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}
