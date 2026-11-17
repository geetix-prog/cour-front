"use server";
import { redirect } from "next/navigation";
import { apiPost } from "@/lib/api/client";
import { setSession } from "@/lib/session";
import type { AuthResponse } from "@/lib/api/types";
import { cookies } from "next/headers";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  let auth: AuthResponse;
  try {
    auth = await apiPost<AuthResponse>("/auth/login", {
      login: form.get("login"),
      password: form.get("password"),
    });
  } catch {
    return { error: "Identifiants incorrects" };
  }
  await setSession(auth.token);
  redirect("/");
}


export async function logout() {
  (await cookies()).delete('session')
}