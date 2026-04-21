"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
console.log("API URL:", BASE_URL);

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseResponse<T>(response: Response, skipUnauthorizedRedirect = false): Promise<T> {
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    const text = await response.text();
    if (text.startsWith("<!DOCTYPE")) {
      throw new Error("API route not found or wrong URL");
    }
    if (response.status === 401 && !skipUnauthorizedRedirect && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    console.error("API error:", response.status, text);
    throw new ApiError(text || "Request failed", response.status);
  }

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    if (text.startsWith("<!DOCTYPE")) {
      throw new Error("API route not found or wrong URL");
    }
    throw new Error(text || "Response is not JSON");
  }

  const payload = await response.json();
  console.log("API response:", payload);
  const normalized =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: unknown }).data
      : payload;
  return normalized as T;
}

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  return [];
}

function buildAuthHeaders(extra?: Record<string, string>) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  };
}

export async function apiGet<T>(url: string, skipUnauthorizedRedirect = false): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "GET",
    credentials: "include",
    headers: buildAuthHeaders(),
  });
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}

export async function apiGetArray<T>(url: string, skipUnauthorizedRedirect = false): Promise<T[]> {
  const result = await apiGet<unknown>(url, skipUnauthorizedRedirect);
  return toArray<T>(result);
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  skipUnauthorizedRedirect = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}

export async function apiPut<T>(
  url: string,
  body?: unknown,
  skipUnauthorizedRedirect = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    credentials: "include",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  skipUnauthorizedRedirect = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PATCH",
    credentials: "include",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}

export async function apiDelete<T>(url: string, skipUnauthorizedRedirect = false): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    credentials: "include",
    headers: buildAuthHeaders(),
  });
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}
