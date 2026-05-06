import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '../api/client';

export interface AuthUser {
  id: number;
  username: string;
  email: string | null;
  role: string;
  org: { id: number; name: string; plan: string } | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  login: async (token, user) => {
    await SecureStore.setItemAsync('auth_token', token);
    setAuthToken(token);
    set({ token, user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token').catch(() => {});
    setAuthToken(null);
    set({ token: null, user: null });
  },

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        setAuthToken(token);
        const client = (await import('../api/client')).default;
        const { data } = await client.get('/auth/me');
        set({ token, user: data });
      }
    } catch {
      await SecureStore.deleteItemAsync('auth_token').catch(() => {});
      setAuthToken(null);
    } finally {
      set({ isLoading: false });
    }
  },
}));
