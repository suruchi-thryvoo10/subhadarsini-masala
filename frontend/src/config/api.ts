// Production & Development API Base URL helper

/**
 * Backend origin used when `VITE_API_URL` is not provided at build time.
 * Keeps a deployed frontend working even if the environment variable is missing
 * from the Vercel project; set VITE_API_URL to override it for any other backend.
 */
const DEFAULT_PRODUCTION_API = 'https://subhadarsini-masala-xs82-beta.vercel.app';

const isLocalHost = (host: string): boolean =>
  host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.local');

const resolveBaseUrl = (): string => {
  const configured = (import.meta.env.VITE_API_URL || '').trim();
  if (configured) return configured.replace(/\/+$/, '');

  // No explicit configuration. In local development the Vite dev server proxies
  // /api to the local backend, so a relative URL is correct. Anywhere else there
  // is no proxy, so requests must go to the deployed backend directly.
  if (typeof window !== 'undefined' && !isLocalHost(window.location.hostname)) {
    return DEFAULT_PRODUCTION_API;
  }

  return '';
};

export const API_BASE_URL = resolveBaseUrl();

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanEndpoint}` : cleanEndpoint;
};

/**
 * De-duplicates concurrent GETs and briefly caches their results.
 *
 * Several components ask for the same thing on one page — the hero and the trust
 * strip both want /stats, and the catalogue and a form both want the product
 * list. Without this each one opened its own request. Identical GETs now share a
 * single in-flight promise, and the result is reused for a short window so a
 * client-side route change does not immediately refetch what was just loaded.
 */
const inFlight = new Map<string, Promise<any>>();
const recent = new Map<string, { value: any; expiresAt: number }>();
const GET_TTL_MS = 30_000;

/** Clears the short-lived GET cache, e.g. after a successful write. */
export const clearApiCache = (): void => {
  recent.clear();
  inFlight.clear();
};

export interface ApiError extends Error {
  status?: number;
  errorCode?: string;
}

/**
 * Fetch JSON from the API and fail loudly.
 *
 * Every caller previously swallowed non-OK responses, which made a broken
 * backend look like an empty catalogue. This surfaces the real error instead.
 */
export const fetchApi = async <T = any>(
  endpoint: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<T> => {
  const { timeoutMs = 15000, ...requestInit } = init;
  const method = (requestInit.method || 'GET').toUpperCase();
  // The cache is keyed by URL alone, so a response that depends on who is
  // asking (anything sent with credentials) must never go into it or be served
  // from it — otherwise the next person to sign in on this browser could be
  // handed the previous user's data.
  const cacheable = method === 'GET' && !new Headers(requestInit.headers).has('Authorization');

  if (cacheable) {
    const fresh = recent.get(endpoint);
    if (fresh && fresh.expiresAt > Date.now()) return fresh.value as T;

    const pending = inFlight.get(endpoint);
    if (pending) return pending as Promise<T>;
  } else {
    // A write can change anything the GET cache is holding.
    clearApiCache();
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const run = async (): Promise<T> => {
  try {
    const res = await fetch(getApiUrl(endpoint), { ...requestInit, signal: controller.signal });
    const body = await res.json().catch(() => null);

    if (!res.ok || (body && body.success === false)) {
      const error: ApiError = new Error(
        body?.message || `Request failed with status ${res.status}`
      );
      error.status = res.status;
      error.errorCode = body?.errorCode;
      throw error;
    }

    return body as T;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      const error: ApiError = new Error('The server took too long to respond. Please try again.');
      error.errorCode = 'TIMEOUT';
      throw error;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
  };

  if (!cacheable) return run();

  const promise = run()
    .then((value) => {
      recent.set(endpoint, { value, expiresAt: Date.now() + GET_TTL_MS });
      return value;
    })
    .finally(() => {
      inFlight.delete(endpoint);
    });

  inFlight.set(endpoint, promise);
  return promise;
};
