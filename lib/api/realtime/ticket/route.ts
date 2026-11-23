import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { apiPost } from "../../client";

export async function POST() {
    const token = await requireSession();
    if(!token) return NextResponse.json({ error: 'unauthorized' }, {status: 401});
    const res = await apiPost('/realtime/ticket');
    const data = await res.json();
    if(!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json({ url: data.url });
}