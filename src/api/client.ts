import axios from 'axios';
import { apiBaseUrl } from '../../config';

const client = axios.create({
  baseURL: apiBaseUrl(),
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Token is injected here from the auth store after login/init.
let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

export function describeApiError(err: any, fallback = 'Something went wrong. Please try again.'): string {
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.message === 'Network Error') return 'Could not reach OpsPilot. Check your connection or backend URL.';
  if (err?.code === 'ECONNABORTED') return 'The request timed out. Pull to refresh and try again.';
  return fallback;
}

client.interceptors.request.use((config) => {
  if (_token) config.headers.Authorization = `Bearer ${_token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const { useAuthStore } = await import('../store/useAuthStore');
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  },
);

export default client;
