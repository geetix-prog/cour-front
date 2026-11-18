"use server";
import { requireSession } from "../session";
import { apiDelete, apiPost } from "../api/client";
import { ApiError } from "next/dist/server/api-utils";
import { refresh } from "next/cache";

export async function toggleLiked(dropId: number, liked: boolean) {
  await requireSession();
  try {
    if (liked) await apiDelete(`/drops/${dropId}/like`);
    else await apiPost(`/drops/${dropId}/like`);
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  refresh();
  return {};
}
