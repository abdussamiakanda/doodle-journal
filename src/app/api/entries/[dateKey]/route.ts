import { NextRequest, NextResponse } from "next/server";
import { getSession, validateSession, clearSessionCookie } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { query } from "@/lib/db-pg";
import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { isValidDateKey } from "@/lib/dates";
import { rowToEntry, EntryRow } from "@/lib/entries";
import { MAX_ENTRY_LENGTH } from "@/lib/constants";
import { JournalEntry } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ dateKey: string }> }
) {
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

  const { dateKey } = await params;

  // Validate date format
  if (!isValidDateKey(dateKey)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  const env = getEnv();
  let row: EntryRow | undefined;

  if (env?.usePostgres) {
    // PostgreSQL path
    const result = await query<EntryRow>(
      "SELECT id, user_id, date_key, text, doodle_id, created_at, updated_at FROM entries WHERE user_id = $1 AND date_key = $2",
      [session.userId, dateKey]
    );
    row = result.rows[0];
  } else {
    // SQLite fallback
    const db = getDb();
    row = db
      .prepare("SELECT * FROM entries WHERE user_id = ? AND date_key = ?")
      .get(session.userId, dateKey) as EntryRow | undefined;
  }

  if (!row) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json({ entry: rowToEntry(row) });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dateKey: string }> }
) {
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

  const { dateKey } = await params;

  // Validate date format
  if (!isValidDateKey(dateKey)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "text is required" },
        { status: 400 }
      );
    }

    if (text.length > MAX_ENTRY_LENGTH) {
      return NextResponse.json(
        { error: `Entry text exceeds maximum length of ${MAX_ENTRY_LENGTH} characters` },
        { status: 400 }
      );
    }

    const env = getEnv();
    let entry: JournalEntry;

    if (env?.usePostgres) {
      // PostgreSQL path
      const existing = await query<EntryRow>(
        "SELECT id, user_id, date_key, text, doodle_id, created_at, updated_at FROM entries WHERE user_id = $1 AND date_key = $2",
        [session.userId, dateKey]
      );

      if (!existing.rows[0]) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
      }

      await query(
        "UPDATE entries SET text = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [text.trim(), existing.rows[0].id]
      );

      const updated = await query<EntryRow>(
        "SELECT id, user_id, date_key, text, doodle_id, created_at, updated_at FROM entries WHERE id = $1",
        [existing.rows[0].id]
      );

      entry = rowToEntry(updated.rows[0]);
    } else {
      // SQLite fallback
      const db = getDb();

      const existing = db
        .prepare("SELECT * FROM entries WHERE user_id = ? AND date_key = ?")
        .get(session.userId, dateKey) as EntryRow | undefined;

      if (!existing) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
      }

      db.prepare(
        "UPDATE entries SET text = ?, updated_at = datetime('now') WHERE id = ?"
      ).run(text.trim(), existing.id);

      const updated = db
        .prepare("SELECT * FROM entries WHERE id = ?")
        .get(existing.id) as EntryRow;

      entry = rowToEntry(updated);
    }

    return NextResponse.json({ entry });
  } catch (error) {
    logger.error("entries.update", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
