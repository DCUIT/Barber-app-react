import { create } from 'zustand';
import type { User, UserRole } from '../types/models';
import { authApi } from '../api/auth';
import { storage } from '../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    const token = await storage.getToken();
    if (!token) { set({ isInitialized: true }); return; }
    try {
      const res = await authApi.getMe();
      set({ user: res.data.user ?? res.data, token, isInitialized: true });
    } catch {
      const raw = await storage.getUser();
      if (raw) {
        try { set({ user: JSON.parse(raw), token, isInitialized: true }); }
        catch { await storage.clear(); set({ isInitialized: true }); }
      } else { set({ isInitialized: true }); }
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login({ username, password });
      const token = res.data.access_token || res.data.token || '';
      const userData = res.data.user ?? { name: res.data.name, role: res.data.role } as User;
      await storage.setToken(token);
      await storage.setUser(JSON.stringify(userData));
      set({ user: userData, token, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, username: string, password: string) => {
    set({ isLoading: true });
    try {
      await authApi.register({ name, username, password });
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await storage.clear();
    set({ user: null, token: null });
  },

  setUser: (user: User) => {
    set({ user });
    storage.setUser(JSON.stringify(user));
  },

  hasRole: (...roles: UserRole[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },
}));
