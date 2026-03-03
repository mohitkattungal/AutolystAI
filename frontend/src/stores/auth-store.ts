import { create } from "zustand";
import { authApi } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  full_name: string;
  account_type: string;
  role: string;
  industry: string | null;
  job_title: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  team_id: string | null;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  /** Initialize — call once in root layout to restore session from localStorage */
  initialize: () => void;

  /** Sign up with email + password via backend */
  signup: (data: {
    email: string;
    password: string;
    full_name: string;
  }) => Promise<{ error: string | null }>;

  /** Sign in with email + password via backend */
  login: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  /** Sign out — clear token and user */
  logout: () => void;

  /** Fetch the user profile from backend */
  fetchProfile: () => Promise<void>;

  /** Get the current access token */
  getToken: () => string | null;
}

const TOKEN_KEY = "autolyst_token";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      set({ token, isAuthenticated: true, isLoading: false });
      get().fetchProfile();
    } else {
      set({ isLoading: false });
    }
  },

  signup: async ({ email, password, full_name }) => {
    set({ isLoading: true });
    try {
      const res = await authApi.signup({ email, password, full_name });
      const { access_token, user } = res.data;
      localStorage.setItem(TOKEN_KEY, access_token);
      set({ token: access_token, user, isAuthenticated: true, isLoading: false });
      return { error: null };
    } catch (err: unknown) {
      set({ isLoading: false });
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Signup failed";
      return { error: message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login({ email, password });
      const { access_token, user } = res.data;
      localStorage.setItem(TOKEN_KEY, access_token);
      set({ token: access_token, user, isAuthenticated: true, isLoading: false });
      return { error: null };
    } catch (err: unknown) {
      set({ isLoading: false });
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Invalid email or password";
      return { error: message };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    try {
      const res = await authApi.me();
      set({ user: res.data });
    } catch {
      // Token invalid — clear auth
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  getToken: () => {
    return get().token;
  },
}));
