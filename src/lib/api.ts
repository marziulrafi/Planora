"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseResponse<T>(
  response: Response,
  skipUnauthorizedRedirect = false
): Promise<T> {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const text = await response.text();
      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
        message = "API route not found or server returned HTML";
      } else {
        try {
          const json = JSON.parse(text);
          message = json.message || text || message;
        } catch {
          message = text || message;
        }
      }
    } catch {
    }

    if (
      response.status === 401 &&
      !skipUnauthorizedRedirect &&
      typeof window !== "undefined"
    ) {
      window.location.href = "/login";
    }

    throw new ApiError(message, response.status);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return undefined as unknown as T;
  }

  const payload = await response.json();
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

function commonOptions(method: string, body?: unknown): RequestInit {
  const init: RequestInit = {
    method,
    credentials: "include",
    headers: body !== undefined ? { "Content-Type": "application/json" } : {},
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  return init;
}

export async function apiGet<T>(
  url: string,
  skipUnauthorizedRedirect = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, commonOptions("GET"));
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}

export async function apiGetArray<T>(
  url: string,
  skipUnauthorizedRedirect = false
): Promise<T[]> {
  const result = await apiGet<unknown>(url, skipUnauthorizedRedirect);
  return toArray<T>(result);
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  skipUnauthorizedRedirect = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, commonOptions("POST", body));
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  skipUnauthorizedRedirect = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, commonOptions("PATCH", body));
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}

export async function apiPut<T>(
  url: string,
  body?: unknown,
  skipUnauthorizedRedirect = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, commonOptions("PUT", body));
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}

export async function apiDelete<T>(
  url: string,
  skipUnauthorizedRedirect = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, commonOptions("DELETE"));
  return parseResponse<T>(res, skipUnauthorizedRedirect);
}
