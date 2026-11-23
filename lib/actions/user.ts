"use server";
import { refresh } from "next/cache";
import { requireSession } from "../session";
import { apiPatch } from "../api/client";

export type UpdateProfileState = { error?: string; success?: boolean };

export async function updateProfile(_prev: UpdateProfileState, form: FormData): Promise<UpdateProfileState> {
  await requireSession();

  const displayName = String(form.get("displayName") ?? "").trim();
  const bio = String(form.get("bio") ?? "").trim();
  const avatarUrl = String(form.get("avatarUrl") ?? "").trim();

  if (!displayName) return { error: "Le nom affiché est obligatoire." };

  try {
    await apiPatch("/auth/me", {
      displayName,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
  refresh();
  return { success: true };
}
