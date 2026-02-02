import axios from 'axios';

const AUTH_STORAGE_KEY = 'auth_token';

/** Read token from sessionStorage (set after Google redirect with #auth=TOKEN). */
function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(AUTH_STORAGE_KEY);
}

/** Clear stored token (e.g. on logout or 401). */
export function clearAuthToken() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/** On client: if URL has #auth=TOKEN (from backend /done redirect), store and strip it. */
function consumeAuthHash() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash || '';
  const match = hash.match(/^#auth=(.+)$/);
  if (match) {
    const token = decodeURIComponent(match[1].trim());
    if (token) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, token);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }
}

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Run once when module loads in browser (e.g. after redirect from /done)
if (typeof window !== 'undefined') consumeAuthHash();

http.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) clearAuthToken();
    return Promise.reject(error);
  },
);
