"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiPost } from "@/lib/api/client";
import { actionError, type ActionState } from "@/lib/api/errors";
import { setSession } from "@/lib/session";
import type { AuthResponse } from "@/lib/api/types";

export async function login(_prev: ActionState, form: FormData): Promise<ActionState> {
  let auth: AuthResponse;
  try {
    auth = await apiPost<AuthResponse>(
      "/auth/login",
      { login: form.get("login"), password: form.get("password") },
      { redirectOn401: false },
    );
  } catch (error) {
    return actionError(error);
  }
  await setSession(auth.token);
  redirect("/");
}

export async function register(_prev: ActionState, form: FormData): Promise<ActionState> {
  let auth: AuthResponse;
  try {
    const bio = String(form.get("bio") ?? "").trim();
    auth = await apiPost<AuthResponse>(
      "/auth/register",
      {
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("registerPassword"),
        displayName: form.get("displayName"),
        bio: bio || null,
      },
      { redirectOn401: false },
    );
  } catch (error) {
    return actionError(error);
  }
  await setSession(auth.token);
  redirect("/");
}

export async function logout() {
  await apiPost("/auth/logout", undefined, { redirectOn401: false }).catch(() => undefined);
  (await cookies()).delete("session");
  redirect("/auth");
}
