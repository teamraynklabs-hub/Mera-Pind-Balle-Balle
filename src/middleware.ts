// middleware.ts (at root or src/middleware.ts)

import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// This is the edge-safe way: we only use session (JWT), not providers or db
export default auth(function middleware(request: NextRequest) {
  const session = (request as any).auth;

  const pathname = request.nextUrl.pathname;

  // 1. Protect all admin pages
  if (pathname.startsWith("/admin")) {
    if (!session?.user || session.user.role !== "admin") {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Optional: Extra early protection for mutating distributor API calls
  // (not strictly needed if requireAdmin is in handlers, but good for security)
  if (
    pathname.startsWith("/api/distributors") &&
    !pathname.endsWith("/distributors") &&           // allow GET /api/distributors
    ["POST", "PATCH", "DELETE"].includes(request.method)
  ) {
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/distributors/:path*",   // protects /api/distributors/[id] etc.
  ],
};