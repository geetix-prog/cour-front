import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiPost } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export async function POST() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

  try {
    const data = await apiPost<{ url: string }>("/realtime/ticket", undefined, { redirectOn401: false });
    return NextResponse.json({ url: data.url });
  } catch (error) {
    const status = error instanceof ApiError && error.status > 0 ? error.status : 502;
    return NextResponse.json({ error: "Impossible d'ouvrir le temps réel." }, { status });
  }
}
