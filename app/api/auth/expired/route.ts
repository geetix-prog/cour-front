import { NextResponse, type NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/auth?expired=1", req.url));
  res.cookies.delete("session");
  return res;
}
