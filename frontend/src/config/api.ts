// Production & Development API Base URL helper
const rawBaseUrl = (import.meta.env.VITE_API_URL || '').trim();

// Automatically sanitize trailing slashes to prevent double-slash (//) redirects on preflight OPTIONS requests
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const getApiUrl = (endpoint: string): string => {
  if (!API_BASE_URL) {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
