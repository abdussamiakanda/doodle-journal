import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSecret } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/register"];

// Content Security Policy headers
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline/eval needed for Next.js
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

function addSecurityHeaders(response: NextResponse): void {
  response.headers.set("Content-Security-Policy", CSP_HEADER);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static assets
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  const token = request.cookies.get("session")?.value;

  if (!token) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    addSecurityHeaders(response);
    return response;
  }

  try {
    await jwtVerify(token, getSecret());
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    addSecurityHeaders(response);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
