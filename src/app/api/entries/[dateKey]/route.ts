import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ dateKey: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dateKey } = await params;

  const db = getDb();
  const row = db
    .prepare("SELECT * FROM entries WHERE user_id = ? AND date_key = ?")
    .get(session.userId, dateKey) as EntryRow | undefined;

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

  const { dateKey } = await params;

  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "text is required" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ entry: rowToEntry(updated) });
  } catch (error) {
    console.error("Update entry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
