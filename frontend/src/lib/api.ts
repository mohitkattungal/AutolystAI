/** Axios-based API client for communicating with the FastAPI backend. */

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ──
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("autolyst_token");
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
      localStorage.removeItem("autolyst_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

/* ─── Auth ─── */
export const authApi = {
  signup: (data: { email: string; password: string; full_name: string; account_type: string }) =>
    api.post<{ access_token: string }>("/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    api.post<{ access_token: string }>("/auth/login", data),

  me: () => api.get("/auth/me"),
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
