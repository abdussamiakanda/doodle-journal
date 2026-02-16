import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSecret } from "@/lib/auth";
import { logger } from "@/lib/logger";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/register"];

const IS_PROD = process.env.NODE_ENV === "production";

function buildCspHeader() {
  // Keep dev permissive for Next.js tooling; tighten in production.
  const scriptSrc = IS_PROD
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

function addSecurityHeaders(response: NextResponse): void {
  response.headers.set("Content-Security-Policy", buildCspHeader());
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

    // Enforce token-version revocation for page routes by probing /api/auth/me.
    // (Middleware cannot directly use sqlite native bindings in edge runtime.)
    if (!pathname.startsWith("/api")) {
      const meUrl = new URL("/api/auth/me", request.url);
      let meRes;
      try {
        meRes = await fetch(meUrl, {
          method: "GET",
          headers: {
            cookie: request.headers.get("cookie") ?? "",
          },
          cache: "no-store",
        });
      } catch {
        // Network error - allow request to proceed with JWT validation already done
        logger.warn("middleware.auth", "failed to reach token-version check endpoint");
        const response = NextResponse.next();
        addSecurityHeaders(response);
        return response;
      }

      if (meRes.status !== 200) {
        logger.warn("middleware.auth", "session invalidated during token-version check");
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.set({
          name: "session",
          value: "",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 0,
        });
        addSecurityHeaders(response);
        return response;
      }
    }

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
