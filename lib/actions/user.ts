"use server";
import { refresh } from "next/cache";
import { requireSession } from "../session";
import { apiPatch } from "../api/client";
import { actionError, type ActionState } from "../api/errors";

export async function updateProfile(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireSession();

  const displayName = String(form.get("displayName") ?? "").trim();
  const bio = String(form.get("bio") ?? "").trim();
  const avatarUrl = String(form.get("avatarUrl") ?? "").trim();

  try {
    await apiPatch("/auth/me", {
      displayName,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
    });
  } catch (error) {
    return actionError(error);
  }
  refresh();
  return { success: true };
}
