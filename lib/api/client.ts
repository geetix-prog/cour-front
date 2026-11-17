import 'server-only'
import { notFound } from 'next/navigation'

export async function apiGet<T>(path: string, token?: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}`} : {}
  })
  if (res.status === 404) notFound()
  if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
}