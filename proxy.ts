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
  "/api/auth/delete",
  "/api/auth/onboarding",
  "/api/profile",
  "/api/feedback",
  // App pages
  "/dashboard",
  "/generate",
  "/board",
  "/portfolio",
  "/interview",
  "/profile",
  "/onboarding",
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

export async function proxy(request: NextRequest) {
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

  // Check if user has completed onboarding (selected a field)
  // If not, redirect them to /onboarding, unless they are already there or logging out
  if (!session.field && pathname !== "/onboarding" && pathname !== "/api/auth/onboarding" && pathname !== "/api/auth/logout" && pathname !== "/api/auth/delete") {
    if (pathname.startsWith("/api/")) {
      return Response.json(
        { success: false, error: "Onboarding required" },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  
  // Prevent user who already has a field from accessing onboarding
  if (session.field && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Attach user info to request headers for downstream route handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-user-name", session.username);
  if (session.field) {
    requestHeaders.set("x-user-field", session.field);
  }

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
