import axios from 'axios';

const AUTH_TOKEN_KEY = 'auth_token';
export function clearAuthToken() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

function readAuthFromHash() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash?.slice(1) || '';
  const match = hash.match(/auth=([^&]*)/);
  if (match) {
    try {
      const token = decodeURIComponent(match[1]);
      if (token) {
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        return token;
      }
    } catch (_) {}
  }
  return null;
}

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  readAuthFromHash();
  const token = typeof window !== 'undefined' ? sessionStorage.getItem(AUTH_TOKEN_KEY) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);
