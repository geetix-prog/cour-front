import "server-only";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { requireSession } from "../session";

export async function apiGet<T>(path: string) {
  const token = (await cookies()).get('session')?.value
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  return res.json() as T;
}

export async function apiPost<T>(path: string, body?: unknown, token?: string) {
  const session = await requireSession()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  return res.json() as T;
}

export async function apiDelete<T>(path: String, token?: string) {
  const session = await requireSession()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "DELETE",
    headers: session ? {Authorization: `Bearer${session}` } : {},
  })
  if (res.status === 404) notFound();
  if(!res.ok) throw new Error(`API ${res.status} sur ${path}`);
  return res.json() as T;
}