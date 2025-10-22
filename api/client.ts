import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, Method } from 'axios';
import { API_BASE_URL, CACHE_DURATION, RETRY_COUNT } from '../constants';

// Extend AxiosRequestConfig to include custom properties for caching
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipCache?: boolean;
}

// Axios instance configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory cache store
const apiCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Generates a unique cache key for a given request configuration.
 */
// Fix: Updated method parameter type to string | undefined and ensured uppercase for consistency.
function generateCacheKey(method: string | undefined = 'GET', url: string, params?: any): string {
  const actualMethod = (method || 'GET').toUpperCase();
  const sortedParams = params ? Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key];
    return acc;
  }, {} as any) : {};
  return `${actualMethod}:${url}:${JSON.stringify(sortedParams)}`;
}

/**
 * Clears a specific entry from the in-memory cache.
 * @param config The Axios request configuration used to generate the cache key.
 */
export function clearCacheEntry(config: CustomAxiosRequestConfig): void {
  const key = generateCacheKey(config.method, config.url!, config.params);
  apiCache.delete(key);
  // console.log(`Cache entry cleared for: ${key}`);
}

/**
 * Clears all entries from the in-memory cache.
 */
export function clearApiCache(): void {
  apiCache.clear();
  // console.log('All API cache entries cleared.');
}

/**
 * Generic API request function with caching and retry logic.
 * @param config Axios request configuration.
 * @returns A promise that resolves with the response data.
 */
export async function apiRequest<T>(config: CustomAxiosRequestConfig): Promise<T> {
  const cacheKey = generateCacheKey(config.method, config.url!, config.params);

  // Check cache
  if (!config.skipCache) {
    const cachedEntry = apiCache.get(cacheKey);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION)) {
      // console.log(`Serving from cache for: ${cacheKey}`);
      return cachedEntry.data as T;
    }
  }

  let attempts = 0;
  while (attempts <= RETRY_COUNT) {
    try {
      const response = await apiClient.request<T>(config);
      if (!config.skipCache) {
        apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        // console.log(`Cached response for: ${cacheKey}`);
      }
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Network error (request sent, no response, or timeout)
        if (error.request && !error.response) {
          console.error("Network Error:", error.message);
          if (attempts < RETRY_COUNT) {
            console.warn(`Retrying request due to network error (Attempt ${attempts + 1}/${RETRY_COUNT})...`);
            attempts++;
            continue; // Retry
          }
        } else if (error.response) {
          // Server error (4xx, 5xx)
          console.error("Server Error:", error.response.status, error.response.data);
        } else {
          // Request setup error
          console.error("Request Setup Error:", error.message);
        }
      } else {
        // Non-Axios error
        console.error("Unexpected Error:", error);
      }
      throw error; // Re-throw if all retries fail or it's not a network error
    }
  }
  // This line should technically not be reached if RETRY_COUNT is handled above,
  // but adding it for TS completeness.
  throw new Error("Failed after multiple attempts.");
}