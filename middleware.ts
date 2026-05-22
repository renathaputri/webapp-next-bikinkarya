import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/api/tasks",
  "/api/portfolio",
  "/api/generate",
  "/api/interview",
  "/api/upload",
  "/api/auth/me",
  "/api/auth/logout",
  "/api/profile",
  // App pages (will be added when frontend is built)
  "/dashboard",
  "/generate",
  "/board",
  "/portfolio",
  "/interview",
  "/profile",
];

// Routes that are always public
const PUBLIC_PREFIXES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/portfolio/public",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Only intercept protected routes
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  // Verify JWT
  const token = getTokenFromRequest(request);
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    // Redirect to login for page routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = await verifyToken(token);
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return Response.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Attach user info to request headers for downstream route handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-user-name", session.username);
  requestHeaders.set("x-user-field", session.field);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    // Match all API routes and app pages, skip static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
