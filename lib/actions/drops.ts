"use server";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "../session";
import { apiDelete, apiPatch, apiPost } from "../api/client";
import { actionError, type ActionState } from "../api/errors";

export type { ActionState };

export async function toggleLiked(dropId: number, liked: boolean): Promise<ActionState> {
  await requireSession();
  try {
    if (liked) await apiDelete(`/drops/${dropId}/like`);
    else await apiPost(`/drops/${dropId}/like`);
  } catch (error) {
    return actionError(error);
  }
  refresh();
  return {};
}

export async function toggleDisliked(dropId: number, disliked: boolean): Promise<ActionState> {
  await requireSession();
  try {
    if (disliked) await apiDelete(`/drops/${dropId}/dislike`);
    else await apiPost(`/drops/${dropId}/dislike`);
  } catch (error) {
    return actionError(error);
  }
  refresh();
  return {};
}

export async function createDrop(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireSession();
  const rawLat = form.get("lat");
  const rawLng = form.get("lng");

  try {
    await apiPost("/drops", {
      title: form.get("title"),
      content: form.get("content"),
      category: form.get("category"),
      lat: rawLat ? Number(rawLat) : 47.49561,
      lng: rawLng ? Number(rawLng) : 6.80544,
      imageUrl: form.get("image") || null,
    });
  } catch (error) {
    return actionError(error);
  }
  redirect("/drops");
}

export async function deleteDrop(dropId: string): Promise<ActionState> {
  await requireSession();
  try {
    await apiDelete(`/drops/${dropId}`);
  } catch (error) {
    return actionError(error);
  }
  redirect("/drops");
}

export async function createDropComment(dropId: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireSession();
  const content = String(form.get("content") ?? "").trim();
  if (!content) return { error: "Le commentaire ne peut pas être vide." };

  try {
    await apiPost(`/drops/${dropId}/comments`, { content });
  } catch (error) {
    return actionError(error);
  }
  refresh();
  return {};
}

export async function deleteDropComment(commentId: number): Promise<ActionState> {
  await requireSession();
  try {
    await apiDelete(`/comments/${commentId}`);
  } catch (error) {
    return actionError(error);
  }
  refresh();
  return {};
}

export async function updateDrop(dropId: number, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireSession();

  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();
  const imageUrl = String(form.get("image") ?? "").trim();
  const lat = Number(form.get("lat"));
  const lng = Number(form.get("lng"));

  try {
    await apiPatch(`/drops/${dropId}`, {
      title,
      content,
      category: form.get("category"),
      imageUrl: imageUrl || null,
      lat,
      lng,
    });
  } catch (error) {
    return actionError(error);
  }
  redirect(`/drops/${dropId}`);
}
