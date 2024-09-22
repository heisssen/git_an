// src/utils/cache.js
export const cacheData = (key, data, ttl = 3600000) => {
    const expiry = Date.now() + ttl; // Set expiry time (1 hour by default)
    const cacheItem = { data, expiry };
    localStorage.setItem(key, JSON.stringify(cacheItem));
};

export const getCachedData = (key) => {
    const cacheItem = localStorage.getItem(key);
    if (!cacheItem) return null;

    const parsedItem = JSON.parse(cacheItem);
    if (Date.now() > parsedItem.expiry) {
        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
    }

    return parsedItem.data;
};
