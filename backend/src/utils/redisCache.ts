import { redis, isRedisReady } from '../config/redis.js';

/**
 * Two-tier read cache.
 *
 * Redis is the shared tier: on serverless every invocation may be a fresh
 * instance, so a per-process cache almost never hits and each request pays for
 * the database round trip. Redis is what actually makes repeat reads cheap.
 *
 * The in-process map is the fallback, used when Redis is not configured or is
 * down. It keeps a single warm instance fast and guarantees the cache layer can
 * never take the site down: every Redis call is wrapped and any failure falls
 * through to the map, and then to MongoDB.
 */

export const CACHE_PREFIX = 'subhadarshini';

/** Default lifetimes, in seconds, by kind of data. */
export const TTL: Record<'products' | 'categories' | 'recipes' | 'stats', number> = {
  /** Catalogue reads: change only when an admin edits or the seed runs. */
  products: 600,
  categories: 1800,
  recipes: 900,
  stats: 300
};

type Entry = { value: unknown; expiresAt: number };

const memory = new Map<string, Entry>();
/** Bounded so a long-lived instance cannot grow the map without limit. */
const MEMORY_MAX_KEYS = 500;

const memoryGet = <T>(key: string): T | null => {
  const hit = memory.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    memory.delete(key);
    return null;
  }
  return hit.value as T;
};

const memorySet = (key: string, value: unknown, ttlSeconds: number) => {
  if (memory.size >= MEMORY_MAX_KEYS) {
    // Drop the oldest insertion; Map preserves insertion order.
    const oldest = memory.keys().next().value;
    if (oldest !== undefined) memory.delete(oldest);
  }
  memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
};

/** Namespaced, stable cache key. */
export const cacheKey = (namespace: string, parts: Record<string, unknown> | string = ''): string => {
  if (typeof parts === 'string') return `${CACHE_PREFIX}:${namespace}${parts ? `:${parts}` : ''}`;
  const normalised = Object.keys(parts)
    .sort()
    .filter((k) => parts[k] !== undefined && parts[k] !== '')
    .map((k) => `${k}=${parts[k]}`)
    .join('&');
  return `${CACHE_PREFIX}:${namespace}${normalised ? `:${normalised}` : ''}`;
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  if (isRedisReady() && redis) {
    try {
      const raw = await redis.get(key);
      if (raw) return JSON.parse(raw) as T;
      return null;
    } catch {
      // fall through to the in-process tier
    }
  }
  return memoryGet<T>(key);
};

export const setCache = async (key: string, value: unknown, ttlSeconds = TTL.products): Promise<void> => {
  memorySet(key, value, ttlSeconds);

  if (isRedisReady() && redis) {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      // The in-process copy above is already stored; nothing else to do.
    }
  }
};

/**
 * Drop every key under one or more namespaces.
 *
 * Uses SCAN rather than KEYS so invalidation cannot block Redis on a large
 * keyspace. Always clears the in-process tier too, so a stale local copy cannot
 * survive an admin edit.
 */
export const invalidateNamespaces = async (...namespaces: string[]): Promise<void> => {
  for (const ns of namespaces) {
    const prefix = `${CACHE_PREFIX}:${ns}`;

    for (const key of [...memory.keys()]) {
      if (key.startsWith(prefix)) memory.delete(key);
    }

    if (isRedisReady() && redis) {
      try {
        let cursor = '0';
        do {
          const [next, keys] = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 200);
          cursor = next;
          if (keys.length) await redis.del(...keys);
        } while (cursor !== '0');
      } catch {
        // Cache stays warm a little longer; TTLs will expire it regardless.
      }
    }
  }
};

/** Read-through helper: return the cached value, or compute, store and return it. */
export const cached = async <T>(key: string, ttlSeconds: number, compute: () => Promise<T>): Promise<T> => {
  const hit = await getCache<T>(key);
  if (hit !== null) return hit;

  const value = await compute();
  await setCache(key, value, ttlSeconds);
  return value;
};

/** Kept for existing call sites that invalidate by pattern. */
export const deleteCachePattern = async (pattern: string): Promise<void> => {
  const namespace = pattern.replace(`${CACHE_PREFIX}:`, '').replace(/[:*].*$/, '');
  await invalidateNamespaces(namespace);
};
