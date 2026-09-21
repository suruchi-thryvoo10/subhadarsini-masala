import { redis } from '../config/redis.js';
const inMemoryFallbackCache = new Map();
export const getCache = async (key) => {
    // Bypasses Redis if REDIS_URL is unconfigured or Redis server is unreachable to prevent hanging serverless responses
    if (!process.env.REDIS_URL || redis.status !== 'ready') {
        const fallback = inMemoryFallbackCache.get(key);
        if (fallback && fallback.expiresAt > Date.now()) {
            return fallback.value;
        }
        return null;
    }
    try {
        const data = await Promise.race([
            redis.get(key),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 400))
        ]);
        if (data)
            return JSON.parse(data);
    }
    catch (err) {
        const fallback = inMemoryFallbackCache.get(key);
        if (fallback && fallback.expiresAt > Date.now()) {
            return fallback.value;
        }
    }
    return null;
};
export const setCache = async (key, value, ttlSeconds = 300) => {
    if (!process.env.REDIS_URL || redis.status !== 'ready') {
        inMemoryFallbackCache.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
        return;
    }
    try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
    catch (err) {
        inMemoryFallbackCache.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }
};
export const deleteCachePattern = async (pattern) => {
    if (!process.env.REDIS_URL || redis.status !== 'ready') {
        for (const key of inMemoryFallbackCache.keys()) {
            if (key.includes(pattern.replace('*', ''))) {
                inMemoryFallbackCache.delete(key);
            }
        }
        return;
    }
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
    catch (err) {
        for (const key of inMemoryFallbackCache.keys()) {
            if (key.includes(pattern.replace('*', ''))) {
                inMemoryFallbackCache.delete(key);
            }
        }
    }
};
