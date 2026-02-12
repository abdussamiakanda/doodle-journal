import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createSession, sessionCookieOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, getRateLimitHeaders } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from "@/lib/constants";

const AUTH_RATE_LIMIT_CONFIG = { windowMs: RATE_LIMIT_WINDOW_MS, maxRequests: RATE_LIMIT_MAX_REQUESTS };

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  token_version: number;
}

export async function POST(request: NextRequest) {
  // Rate limiting check
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(`login:${clientIp}`, AUTH_RATE_LIMIT_CONFIG);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult, AUTH_RATE_LIMIT_CONFIG)
      }
    );
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = getDb();

    const user = db
      .prepare("SELECT id, username, password_hash, token_version FROM users WHERE username = ?")
      .get(username) as UserRow | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await createSession({
      userId: user.id,
      username: user.username,
      tokenVersion: user.token_version,
    });

    const response = NextResponse.json({
      user: { id: user.id, username: user.username },
    });

    response.cookies.set(sessionCookieOptions(token));

    return response;
  } catch (error) {
    logger.error("auth.login", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
