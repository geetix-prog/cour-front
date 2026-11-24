"use server";
import { redirect } from "next/navigation";
import { apiPost } from "@/lib/api/client";
import { setSession } from "@/lib/session";
import type { AuthResponse } from "@/lib/api/types";
import { cookies, headers } from "next/headers";

export type LoginState = { error?: string };
export type RegisterState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  let auth: AuthResponse;
  try {
    const body = {
      login: form.get("login"),
      password: form.get("password")
    };

    auth = await apiPost<AuthResponse>("/auth/login", body);
  } catch {
    return { error: "Identifiants incorrects" };
  }
  await setSession(auth.token);
  redirect("/");
}

export async function register(_prev: RegisterState, form: FormData): Promise<RegisterState> {
  let auth: AuthResponse;
  try {
    const body = {
      username: form.get("username"),
      email: form.get("email"),
      password: form.get("registerPassword"),
      displayName: form.get("displayName"),
      bio: form.get("bio"),
    };
    auth = await apiPost<AuthResponse>("/auth/register", body);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
  redirect("/auth");
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/auth");
}
