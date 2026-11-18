"use server";
import { requireSession } from "../session";
import { apiDelete, apiPost } from "../api/client";
import { ApiError } from "next/dist/server/api-utils";
import { refresh } from "next/cache";
import { redirect } from "next/navigation"

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

export type CreationState = { error?: string };

export async function createDrop(form: FormData) {
  try {
    const body = {
      username: form.get("username"),
      email: form.get("email"),
      password: form.get("password"),
      displayName: form.get("displayName"),
      bio: form.get("bio"),
    };
    const res = await apiPost('/drops', body)
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
  redirect("/drops");
}