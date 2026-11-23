"server-only";
import { apiGet } from "./client";
import type { PrivateUser } from "./types";
import { requireSession } from "../session";

export async function getMe() {
  await requireSession();
  return apiGet<PrivateUser>("/auth/me");
}
