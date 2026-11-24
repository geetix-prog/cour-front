import "server-only";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ApiError } from "./errors";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

type RequestOptions = {
  body?: unknown;
  redirectOn401?: boolean;
};

async function request<T>(method: Method, path: string, { body, redirectOn401 = true }: RequestOptions = {}): Promise<T> {
  const token = (await cookies()).get("session")?.value;

  let res: Response;
  try {
    res = await fetch(`${process.env.API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "API injoignable");
  }

  if (res.ok) {
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  if (res.status === 401 && redirectOn401) redirect("/api/auth/expired");

  if (res.status === 404 && method === "GET") notFound();

  const data = await res.json().catch(() => null);
  throw new ApiError(res.status, data?.error?.message ?? res.statusText, data?.error?.fields);
}

export function apiGet<T>(path: string) {
  return request<T>("GET", path);
}

export function apiPost<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body">) {
  return request<T>("POST", path, { ...options, body });
}

export function apiPatch<T>(path: string, body: unknown) {
  return request<T>("PATCH", path, { body });
}

export function apiDelete<T>(path: string) {
  return request<T>("DELETE", path);
}
