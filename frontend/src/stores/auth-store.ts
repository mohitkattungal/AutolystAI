import { create } from "zustand";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  full_name: string;
  account_type: string;
  industry: string | null;
  job_title: string | null;
  onboarding_completed: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; full_name: string; account_type: string }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("autolyst_token") : null,
  isLoading: false,
  isAuthenticated: false,

  setToken: (token: string) => {
    localStorage.setItem("autolyst_token", token);
    set({ token });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login({ email, password });
      const token = res.data.access_token;
      localStorage.setItem("autolyst_token", token);
      set({ token });
      await get().fetchUser();
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (data) => {
    set({ isLoading: true });
    try {
      const res = await authApi.signup(data);
      const token = res.data.access_token;
      localStorage.setItem("autolyst_token", token);
      set({ token });
      await get().fetchUser();
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("autolyst_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const res = await authApi.me();
      set({ user: res.data, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
