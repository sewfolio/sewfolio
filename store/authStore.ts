import { create } from 'zustand';
import { User, authApi, getToken, setToken, removeToken } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loadUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  loadUser: async () => {
    try {
      const token = await getToken();
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      const user = await authApi.me();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      await removeToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const { user, token } = await authApi.login({ email, password });
    await setToken(token);
    set({ user, token, isAuthenticated: true });
  },

  signup: async (name, email, password) => {
    const { user, token } = await authApi.signup({ name, email, password });
    await setToken(token);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));
