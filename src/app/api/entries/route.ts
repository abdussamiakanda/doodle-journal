import { NextRequest, NextResponse } from "next/server";
import { getSession, validateSession, clearSessionCookie } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { query } from "@/lib/db-pg";
import { getEnv } from "@/lib/env";
import { getRandomUnusedDoodleId } from "@/lib/doodle-pool";
import { JournalEntry, DateKey, DoodleId } from "@/types";
import { logger } from "@/lib/logger";
import { rowToEntry, EntryRow } from "@/lib/entries";
import { checkRateLimit, getClientIp, getRateLimitHeaders } from "@/lib/rate-limiter";
import { MAX_ENTRY_LENGTH } from "@/lib/constants";

const AUTH_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 5 };
const DATA_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 30 };

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit GET requests
  const clientIp = getClientIp(request);
  if (!clientIp) {
    return NextResponse.json(
      { error: "Unable to identify client" },
      { status: 400 }
    );
  }

  const rateLimit = checkRateLimit(clientIp, DATA_RATE_LIMIT);
  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
    Object.entries(getRateLimitHeaders(rateLimit, DATA_RATE_LIMIT)).forEach(
      ([key, value]) => response.headers.set(key, value)
    );
    return response;
  }

  // Validate session token version
  const validSession = await validateSession(session);
  if (!validSession) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    response.cookies.set(clearSessionCookie());
    return response;
  }

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  const env = getEnv();
  let rows: EntryRow[];
  let usedDoodleIds: DoodleId[] = [];

  if (env?.usePostgres) {
    // PostgreSQL path
    const result = await query<EntryRow>(
      "SELECT id, user_id, date_key, text, doodle_id, created_at, updated_at FROM entries WHERE user_id = $1 AND date_key LIKE $2 ORDER BY date_key",
      [session.userId, `${year}-%`]
    );
    rows = result.rows;
    for (const row of rows) {
      usedDoodleIds.push(row.doodle_id as DoodleId);
    }
  } else {
    // SQLite fallback
    const db = getDb();
    rows = db
      .prepare(
        "SELECT * FROM entries WHERE user_id = ? AND date_key LIKE ? ORDER BY date_key"
      )
      .all(session.userId, `${year}-%`) as EntryRow[];

    for (const row of rows) {
      usedDoodleIds.push(row.doodle_id);
    }
  }

  const entries: Record<DateKey, JournalEntry> = {};

  for (const row of rows) {
    entries[row.date_key] = rowToEntry(row);
  }

  return NextResponse.json({ entries, usedDoodleIds });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate session token version
  const validSession = await validateSession(session);
  if (!validSession) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    response.cookies.set(clearSessionCookie());
    return response;
  }

  try {
    const body = await request.json();
    const { dateKey, text } = body;

    if (!dateKey || !text || typeof text !== "string") {
      return NextResponse.json(
        { error: "dateKey and text are required" },
        { status: 400 }
      );
    }

    if (text.length > MAX_ENTRY_LENGTH) {
      return NextResponse.json(
        { error: `Entry text exceeds maximum length of ${MAX_ENTRY_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const env = getEnv();
    let entry: JournalEntry;

    if (env?.usePostgres) {
      // PostgreSQL path
      // Check for existing entry
      const existing = await query<{ id: number }>(
        "SELECT id FROM entries WHERE user_id = $1 AND date_key = $2",
        [session.userId, dateKey]
      );

      if (existing.rows.length > 0) {
        return NextResponse.json(
          { error: "Entry already exists for this date" },
          { status: 409 }
        );
      }

      // Get used doodle IDs for this user to assign a unique one
      const usedResult = await query<{ doodle_id: number }>(
        "SELECT DISTINCT doodle_id FROM entries WHERE user_id = $1",
        [session.userId]
      );

      const usedIds = usedResult.rows.map((r) => r.doodle_id);
      const doodleId = getRandomUnusedDoodleId(usedIds);

      const result = await query<EntryRow>(
        "INSERT INTO entries (user_id, date_key, text, doodle_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [session.userId, dateKey, text.trim(), doodleId]
      );

      entry = rowToEntry(result.rows[0]);
    } else {
      // SQLite fallback
      const db = getDb();

      // Check for existing entry
      const existing = db
        .prepare("SELECT id FROM entries WHERE user_id = ? AND date_key = ?")
        .get(session.userId, dateKey);

      if (existing) {
        return NextResponse.json(
          { error: "Entry already exists for this date" },
          { status: 409 }
        );
      }

      // Get used doodle IDs for this user to assign a unique one
      const usedRows = db
        .prepare("SELECT DISTINCT doodle_id FROM entries WHERE user_id = ?")
        .all(session.userId) as { doodle_id: number }[];

      const usedIds = usedRows.map((r) => r.doodle_id);
      const doodleId = getRandomUnusedDoodleId(usedIds);

      const result = db
        .prepare(
          "INSERT INTO entries (user_id, date_key, text, doodle_id) VALUES (?, ?, ?, ?)"
        )
        .run(session.userId, dateKey, text.trim(), doodleId);

      const row = db
        .prepare("SELECT * FROM entries WHERE id = ?")
        .get(result.lastInsertRowid) as EntryRow;

      entry = rowToEntry(row);
    }

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    logger.error("entries.create", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
