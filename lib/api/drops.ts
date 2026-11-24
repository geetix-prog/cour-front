import "server-only";
import { apiGet } from "./client";
import type { CommentPage, Drop, DropPage } from "./types";
import { requireSession } from "../session";

export async function getDrop(dropId: string | number) {
  await requireSession();
  return apiGet<Drop>(`/drops/${dropId}`);
}

export async function getDropComments(dropId: string | number) {
  await requireSession();
  return apiGet<CommentPage>(`/drops/${dropId}/comments`);
}

export async function getDrops(params?: URLSearchParams) {
  await requireSession();
  const query = params?.toString();
  return apiGet<DropPage>(`/drops${query ? `?${query}` : ""}`);
}
