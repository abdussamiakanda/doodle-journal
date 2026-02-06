import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getRandomUnusedDoodleId } from "@/lib/doodle-pool";
import { JournalEntry, DateKey, DoodleId } from "@/types";

interface EntryRow {
  id: number;
  user_id: number;
  date_key: string;
  text: string;
  doodle_id: number;
  created_at: string;
  updated_at: string;
}

function rowToEntry(row: EntryRow): JournalEntry {
  return {
    dateKey: row.date_key as DateKey,
    text: row.text,
    doodleId: row.doodle_id as DoodleId,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  const db = getDb();

  // Verify user still exists in DB (guards against stale session cookies)
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(session.userId);
  if (!user) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    response.cookies.set({ name: "session", value: "", path: "/", maxAge: 0 });
    return response;
  }

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

    // Verify user still exists in DB
    const user = db.prepare("SELECT id FROM users WHERE id = ?").get(session.userId);
    if (!user) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      response.cookies.set({ name: "session", value: "", path: "/", maxAge: 0 });
      return response;
    }

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
    console.error("Create entry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
