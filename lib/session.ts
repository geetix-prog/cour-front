import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function setSession(token: string) {
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function requireSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) redirect("/login");
  return token;
}
