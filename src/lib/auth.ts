import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME, JWT_EXPIRY_DAYS } from "@/lib/constants";

function isSecureCookie(): boolean {
  if (process.env.COOKIE_SECURE !== undefined) {
    return process.env.COOKIE_SECURE === "true";
  }
  return process.env.NODE_ENV === "production";
}

export function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: number;
  username: string;
  tokenVersion: number;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRY_DAYS}d`)
    .sign(getSecret());

  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as number,
      username: payload.username as string,
      tokenVersion: (payload.tokenVersion as number) ?? 0,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Validate that the session's token version matches the database
 * Returns the valid session or null if invalid
 */
export async function validateSession(session: SessionPayload | null): Promise<SessionPayload | null> {
  if (!session) return null;

  // Dynamic import to avoid circular dependency
  const { query } = await import("./db-pg");
  const { getEnv } = await import("./env");

  const env = getEnv();
  if (!env?.usePostgres) {
    // Fallback to SQLite
    const { getDb } = await import("./db");
    const db = getDb();
    const user = db
      .prepare("SELECT token_version FROM users WHERE id = ?")
      .get(session.userId) as { token_version: number } | undefined;

    if (!user || user.token_version !== session.tokenVersion) {
      return null;
    }
    return session;
  }

  // Use PostgreSQL
  const result = await query<{ token_version: number }>(
    "SELECT token_version FROM users WHERE id = $1",
    [session.userId]
  );

  const user = result.rows[0];
  if (!user || user.token_version !== session.tokenVersion) {
    return null;
  }

  return session;
}

/**
 * Invalidate all sessions for a user by incrementing their token version
 */
export async function invalidateUserSessions(userId: number): Promise<void> {
  const { getEnv } = await import("./env");

  const env = getEnv();
  if (!env?.usePostgres) {
    // Fallback to SQLite
    const { getDb } = await import("./db");
    const db = getDb();
    db.prepare("UPDATE users SET token_version = token_version + 1 WHERE id = ?").run(userId);
    return;
  }

  // Use PostgreSQL
  const { query } = await import("./db-pg");
  await query("UPDATE users SET token_version = token_version + 1 WHERE id = $1", [userId]);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: JWT_EXPIRY_DAYS * 24 * 60 * 60,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
