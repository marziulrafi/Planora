import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

type ApiClient = Omit<AxiosInstance, "get" | "post" | "patch" | "put" | "delete"> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://planora-server-mozw.onrender.com/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
}) as ApiClient;

api.interceptors.response.use((response) => response.data?.data ?? response.data);

export default api;
