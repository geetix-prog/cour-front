"use server";
import { requireSession } from "../session";
import { apiDelete, apiPost } from "../api/client";
import { ApiError } from "next/dist/server/api-utils";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

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

export type createDropState = { error?: string };

export async function createDrop(_prev: createDropState, form: FormData): Promise<createDropState> {
  await requireSession();
  try {
    const rawLat = form.get('lat');
    const rawLng = form.get('lng');

    const body = {
      title: form.get('title'),
      content: form.get('content'),
      category: form.get('category'),
      lat: rawLat ? Number(rawLat) : 47.49561,
      lng: rawLng ? Number(rawLng) : 6.80544,
      imageUrl: form.get('image'),
    };
    console.log(body)
    await apiPost("/drops", body);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
  redirect("/drops");
}

export type CommentState = { error?: string };

export async function createDropComment(dropId: string, _prev: CommentState, form: FormData): Promise<CommentState> {
  await requireSession();
  const content = String(form.get("content") ?? "").trim();
  if (!content) return { error: "Le commentaire ne peut pas être vide." };

  try {
    await apiPost(`/drops/${dropId}/comments`, { content });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
  refresh();
  return {};
}
