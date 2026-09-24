import { Redis } from 'ioredis';

/**
 * Shared cache connection.
 *
 * Redis is optional. When REDIS_URL is absent the client is never created and
 * every cache call falls through to an in-process map, so the app runs happily
 * without it — locally, and on a deployment where Redis has not been provisioned.
 *
 * When it *is* configured the connection is opened eagerly but without blocking
 * startup. A previous version used `lazyConnect` and never called `connect()`,
 * so the client sat in the "wait" state forever and every read silently used the
 * in-process fallback instead of the shared cache.
 */

const redisUrl = (process.env.REDIS_URL || '').trim();

export const isRedisConfigured = Boolean(redisUrl);

/**
 * Host and scheme only, never credentials — enough to tell from a health check
 * whether REDIS_URL points somewhere a deployed function can actually reach.
 * A URL like redis://redis:6379 works in Docker Compose and resolves nowhere on
 * Vercel, which looks identical to an outage unless the host is visible.
 */
export const redisTarget = (): string | null => {
  if (!redisUrl) return null;
  try {
    const u = new URL(redisUrl);
    return `${u.protocol}//${u.hostname}:${u.port || '6379'}`;
  } catch {
    return 'unparseable';
  }
};

export const redis: Redis | null = isRedisConfigured
  ? new Redis(redisUrl, {
      lazyConnect: true,
      // A request should never queue behind a reconnect; fail fast to the fallback.
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 5000,
      retryStrategy(times: number) {
        if (times > 5) return null;
        return Math.min(times * 200, 3000);
      }
    })
  : null;

let connected = false;

if (redis) {
  redis.on('ready', () => {
    connected = true;
    console.log('[Redis] Connected — shared cache active.');
  });

  redis.on('end', () => {
    connected = false;
  });

  redis.on('error', (err: any) => {
    connected = false;
    // Logged once per transition rather than per failed command, so a Redis
    // outage degrades quietly instead of flooding the logs.
    if (!(redis as any).__loggedError) {
      (redis as any).__loggedError = true;
      console.warn(`[Redis] Unavailable (${err.message}) — falling back to in-process cache.`);
    }
  });

  // Kick the connection off without awaiting it: a Redis outage must not stop
  // the API from serving requests straight from MongoDB.
  redis.connect().catch(() => undefined);
}

/** True only when commands can actually be served right now. */
export const isRedisReady = (): boolean => connected && redis?.status === 'ready';

export const checkRedisHealth = (): boolean => isRedisReady();
