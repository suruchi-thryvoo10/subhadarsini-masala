import { redis } from '../config/redis.js';
const inMemoryFallbackCache = new Map();
export const getCache = async (key) => {
    try {
        const data = await redis.get(key);
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
