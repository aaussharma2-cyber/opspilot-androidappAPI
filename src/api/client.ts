import axios from 'axios';
import BASE_URL from '../../config';

const client = axios.create({
  baseURL: `${BASE_URL}api`,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Token is injected here from the auth store after login/init.
let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
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
