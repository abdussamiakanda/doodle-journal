import { NextResponse } from "next/server";
import { clearSessionCookie, getSession, invalidateUserSessions } from "@/lib/auth";
import { checkRateLimit, getClientIp, getRateLimitHeaders } from "@/lib/rate-limiter";

const LOGOUT_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 10 };

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  if (!clientIp) {
    return NextResponse.json(
      { error: "Unable to identify client" },
      { status: 400 }
    );
  }

  const rateLimit = checkRateLimit(clientIp, LOGOUT_RATE_LIMIT);
  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
    Object.entries(getRateLimitHeaders(rateLimit, LOGOUT_RATE_LIMIT)).forEach(
      ([key, value]) => response.headers.set(key, value)
    );
    return response;
  }

  const session = await getSession();

  // Invalidate all sessions for this user
  if (session) {
    await invalidateUserSessions(session.userId);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(clearSessionCookie());
  return response;
}
