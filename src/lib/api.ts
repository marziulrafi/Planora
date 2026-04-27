import axios, { AxiosError, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://planora-server-mozw.onrender.com//api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data?.data ?? response.data;
  },
  (error: AxiosError) => {
    let message = "An error occurred";

    if (error.response) {
      message =
        (error.response.data as any)?.error ||
        (error.response.data as any)?.message ||
        error.message;
    } else if (error.request) {
      message = "Network error - server not responding";
    } else {
      message = error.message;
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const isAuthPage = pathname === "/login" || pathname === "/register";
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(new Error(message));
  }
);

export async function apiGet<T>(url: string): Promise<T> {
  const response = await api.get<T>(url);
  return response;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const response = await api.post<T>(url, body);
  return response;
}

export async function apiPatch<T>(url: string, body: unknown): Promise<T> {
  const response = await api.patch<T>(url, body);
  return response;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await api.delete<T>(url);
  return response;
}

export default api;
