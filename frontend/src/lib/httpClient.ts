/**
 * Axios HTTP Client — Centralized config
 *
 * Module này là điểm duy nhất để cấu hình Axios cho toàn bộ dự án.
 * Tất cả API calls đều phải thông qua instance này.
 */
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// ─── Constants ───────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const TIMEOUT_MS = 15_000;

const TOKEN_KEY = 'fb_clone_token';

// ─── Create Instance ──────────────────────────────────────────────────────────

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Token Helpers (SSR safe) ─────────────────────────────────────────────────

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },
};

// ─── Request Interceptor ──────────────────────────────────────────────────────

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    // 401 → clear token & redirect to login
    if (status === 401) {
      tokenStorage.remove();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // 403 → Forbidden — có thể xử lý thêm
    if (status === 403) {
      console.warn('[httpClient] 403 Forbidden:', error.config?.url);
    }

    // Normalize error để dễ handle ở service layer
    return Promise.reject(error);
  }
);

export default httpClient;
