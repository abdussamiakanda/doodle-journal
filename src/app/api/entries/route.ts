import { NextRequest, NextResponse } from "next/server";
import { getSession, validateSession, clearSessionCookie } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getRandomUnusedDoodleId } from "@/lib/doodle-pool";
import { JournalEntry, DateKey, DoodleId } from "@/types";
import { logger } from "@/lib/logger";
import { rowToEntry, EntryRow } from "@/lib/entries";

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  const db = getDb();

  const rows = db
    .prepare(
      "SELECT * FROM entries WHERE user_id = ? AND date_key LIKE ? ORDER BY date_key"
    )
    .all(session.userId, `${year}-%`) as EntryRow[];

  const entries: Record<DateKey, JournalEntry> = {};
  const usedDoodleIds: DoodleId[] = [];

  for (const row of rows) {
    entries[row.date_key] = rowToEntry(row);
    usedDoodleIds.push(row.doodle_id);
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

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ entry: rowToEntry(row) }, { status: 201 });
  } catch (error) {
    logger.error("entries.create", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
