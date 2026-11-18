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

export async function Register(_prev: RegisterState, form: FormData): Promise<RegisterState> {
  let auth: AuthResponse;
  try {
    const body = {
      username: form.get("username"),
      email: form.get("email"),
      password: form.get("password"),
      displayName: form.get("displayName"),
      bio: form.get("bio"),
    };
    console.log("Register body:", body);
    auth = await apiPost<AuthResponse>("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
  redirect("/auth");
}

export async function logout() {
  (await cookies()).delete("session");
}
