import "server-only";
import { notFound } from "next/navigation";

export async function apiGet<T>(path: string, token?: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  return res.json() as T;
}

export async function apiPost<T>(path: string, body?: unknown, token?: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  return res.json() as T;
}
