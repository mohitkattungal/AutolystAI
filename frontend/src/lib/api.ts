/** Axios-based API client for communicating with the FastAPI backend. */

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "autolyst_token";

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT from localStorage ──
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor: handle 401 ──
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

/* ─── Auth ─── */
export const authApi = {
  /** Sign up — returns JWT + user */
  signup: (data: { email: string; password: string; full_name: string }) =>
    api.post("/auth/signup", data),

  /** Login — returns JWT + user */
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  /** Get current user profile */
  me: () => api.get("/auth/me"),

  /** Update profile fields (name, industry, job title, avatar) */
  updateProfile: (data: {
    full_name?: string;
    industry?: string;
    job_title?: string;
    avatar_url?: string;
  }) => api.patch("/auth/profile", data),

  /** Complete onboarding — sets account_type, industry, job_title */
  completeOnboarding: (data: {
    account_type?: string;
    industry?: string;
    job_title?: string;
  }) => api.post("/auth/onboarding", data),

  /** Change password */
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post("/auth/change-password", data),
};

/* ─── Datasets ─── */
export const datasetsApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/datasets/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  list: () => api.get("/datasets/"),

  get: (id: string) => api.get(`/datasets/${id}`),

  delete: (id: string) => api.delete(`/datasets/${id}`),
};

/* ─── Chat ─── */
export const chatApi = {
  send: (data: { message: string; conversation_id?: string; dataset_id?: string }) =>
    api.post("/chat/send", data),

  listConversations: () => api.get("/chat/conversations"),

  getConversation: (id: string) => api.get(`/chat/conversations/${id}`),
};

/* ─── Analysis ─── */
export const analysisApi = {
  run: (data: { dataset_id: string; analysis_type: string; prompt?: string }) =>
    api.post("/analysis/run", data),

  list: () => api.get("/analysis/"),

  get: (id: string) => api.get(`/analysis/${id}`),
};

/* ─── Health ─── */
export const healthApi = {
  check: () => axios.get(`${API_BASE}/api/health`),
};

export default api;
