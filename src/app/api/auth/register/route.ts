import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createSession, sessionCookieOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, getRateLimitHeaders } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";
import {
  BCRYPT_SALT_ROUNDS,
  MIN_PASSWORD_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_PATTERN,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
} from "@/lib/constants";

const AUTH_RATE_LIMIT_CONFIG = { windowMs: RATE_LIMIT_WINDOW_MS, maxRequests: RATE_LIMIT_MAX_REQUESTS };

export async function POST(request: NextRequest) {
  // Rate limiting check
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(`register:${clientIp}`, AUTH_RATE_LIMIT_CONFIG);

  if (!rateLimitResult.allowed) {
    logger.warn("auth.register", `rate_limit_exceeded ip=${clientIp}`);
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
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

    if (!USERNAME_PATTERN.test(username) || username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Username must be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters (letters, numbers, underscores)` },
        { status: 400 }
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    const db = getDb();

    const existing = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);

    if (existing) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const result = db
      .prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
      .run(username, passwordHash);

    const userId = result.lastInsertRowid as number;
    const token = await createSession({ userId, username, tokenVersion: 0 });

    const response = NextResponse.json(
      { user: { id: userId, username } },
      { status: 201 }
    );

    response.cookies.set(sessionCookieOptions(token));

    return response;
  } catch (error) {
    logger.error("auth.register", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
