import "server-only";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { requireSession } from "../session";

export async function apiGet<T>(path: string) {
  const token = (await cookies()).get("session")?.value;

  const res = await fetch(`${process.env.API_URL}${path}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  return res.json() as T;
}

export async function apiPost<T>(path: string, body?: unknown, token?: string) {
  const session = (await cookies()).get("session")?.value;

  const res = await fetch(`${process.env.API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 404) notFound();
  if (!res.ok) {
    const detail = await res.text();
    console.error(`API ${res.status} sur ${path}`, detail);
    throw new Error(`API ${res.status} sur ${path} : ${detail}`);
  }
  return res.json() as T;
}

export async function apiDelete<T>(path: string, token?: string) {
  const session = await requireSession();

  const res = await fetch(`${process.env.API_URL}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session}` } : {}),
    },
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  if (res.status === 204) return undefined as T;
  return res.json() as T;
}
