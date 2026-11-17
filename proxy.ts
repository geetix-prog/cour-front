import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  if (req.cookies.has('session')) return
  return NextResponse.redirect(new URL('/login', req.url))
}

export const config = { matcher: ['/drops/:path*']}