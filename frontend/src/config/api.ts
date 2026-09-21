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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
