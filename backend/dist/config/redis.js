import { Redis } from 'ioredis';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redis = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
        if (times > 3) {
            console.warn('[Redis] Max reconnect attempts reached. Redis will operate in fallback mode.');
            return null;
        }
        return Math.min(times * 100, 2000);
    }
});
let isRedisConnected = false;
redis.on('connect', () => {
    isRedisConnected = true;
    console.log('[Redis] Connected to Redis server.');
});
redis.on('error', (err) => {
    isRedisConnected = false;
    // Silent warning for graceful degradation
});
export const checkRedisHealth = () => isRedisConnected;
