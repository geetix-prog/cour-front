"server-only";
import { apiGet } from "./client";
import type { PrivateUser, Profile } from "./types";
import { requireSession } from "../session";

export async function getMe() {
  await requireSession();
  return apiGet<PrivateUser>("/auth/me");
}

export async function getUser(username: string) {
  await requireSession();
  return apiGet<Profile>(`/users/${username}`)
}