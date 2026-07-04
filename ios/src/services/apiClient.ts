// ============================================================
// OrbitPay - Axios API Client with JWT Auth + Auto-Refresh
// ============================================================
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { SecureStore } from '../utils/secureStorage';
import type { AuthTokens } from '../types';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject:  (reason?: unknown) => void;
}> = [];

function processQueue(error: AxiosError | null, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL:         API_BASE_URL,
    timeout:         30_000,
    headers: {
      'Content-Type': 'application/json',
      'Accept':        'application/json',
      'X-App-Platform': 'ios',
      'X-App-Version':  '1.0.0',
    },
  });

  // ---- Request interceptor: attach access token ------------
  client.interceptors.request.use(async (config) => {
    const tokens = await SecureStore.getAuthTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  });

  // ---- Response interceptor: handle 401 / refresh ----------
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentTokens = await SecureStore.getAuthTokens();
        if (!currentTokens?.refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post<{ data: AuthTokens }>(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken: currentTokens.refreshToken },
        );

        const newTokens = data.data;
        await SecureStore.setAuthTokens(newTokens);
        processQueue(null, newTokens.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        await SecureStore.clearAll();
        // Dispatch logout event for the app to pick up
        // Handled in the auth store
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );

  return client;
}

export const apiClient = createApiClient();

// ---- Typed helper wrappers ---------------------------------
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<{ data: T }>(url, config).then(r => r.data.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<{ data: T }>(url, data, config).then(r => r.data.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<{ data: T }>(url, data, config).then(r => r.data.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<{ data: T }>(url, data, config).then(r => r.data.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<{ data: T }>(url, config).then(r => r.data.data),
};
