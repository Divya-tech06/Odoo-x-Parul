const cache = new Map<string, { data: unknown; expiresAt: number }>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    if (entry) cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached(key: string, data: unknown, ttlMs: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// TTL constants
export const CACHE_TTL = {
  CITIES: 5 * 60 * 1000,         // 5 minutes
  WEATHER: 30 * 60 * 1000,       // 30 minutes
  EXCHANGE: 60 * 60 * 1000,      // 1 hour
  IMAGES: 24 * 60 * 60 * 1000,   // 24 hours
} as const;
