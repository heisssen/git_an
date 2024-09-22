// src/utils/apiCache.js
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Function to store data in the cache
export const cacheData = (key, data, ttl = CACHE_TTL) => {
    const expiry = Date.now() + ttl;
    const cacheItem = { data, expiry };
    localStorage.setItem(key, JSON.stringify(cacheItem));
};

// Function to retrieve data from the cache
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

// Function to clear the cache for a specific key
export const clearCache = (key) => {
    localStorage.removeItem(key);
};
