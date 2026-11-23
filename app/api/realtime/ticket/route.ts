import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { apiPost } from "@/lib/api/client";

export async function POST() {
  await requireSession();
  try {
    const data = await apiPost<{ url: string }>("/realtime/ticket");
    return NextResponse.json({ url: data.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Une erreur est survenue" },
      { status: 502 },
    );
  }
}
