import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

type ApiClient = Omit<AxiosInstance, "get" | "post" | "patch" | "put" | "delete"> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

const isServer = typeof window === "undefined";

const ensureApiPrefix = (url: string) => {
  const withoutTrailingSlash = url.replace(/\/+$/, "");
  return /\/api$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
};

const normalizeBaseURL = (baseURL?: string) => {
  const trimmed = baseURL?.trim();
  const serverFallback =
    process.env.API_URL?.trim() ||
    process.env.BACKEND_URL?.trim() ||
    "http://localhost:5000";

  if (!trimmed) {
    return isServer ? ensureApiPrefix(serverFallback) : "/api";
  }

  const isAbsolute = /^https?:\/\//i.test(trimmed);
  if (!isAbsolute) return trimmed;

  if (!isServer) return "/api";

  return ensureApiPrefix(trimmed);
};

const api = axios.create({
  baseURL: normalizeBaseURL(process.env.NEXT_PUBLIC_API_URL),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
}) as ApiClient;

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    if (error?.response?.status === 401) {
      console.error("401 error", error.response?.data);
    }
    return Promise.reject(error);
  }
);

export const ensureSession = async () => {
  try {
    const session = await api.get<{ user?: unknown }>("/auth/get-session");
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    return session;
  } catch (error) {
    if ((error as { response?: { status?: number } })?.response?.status !== 404) {
      throw error;
    }
    const fallbackSession = await api.get<{ user?: unknown }>("/auth/session");
    if (!fallbackSession?.user) {
      throw new Error("Unauthorized");
    }
    return fallbackSession;
  }
};

export default api;
