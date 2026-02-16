import { NextRequest, NextResponse } from "next/server";
import { getSession, validateSession, clearSessionCookie } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { logger } from "@/lib/logger";
import { isValidDateKey } from "@/lib/dates";
import { rowToEntry, EntryRow } from "@/lib/entries";
import { MAX_ENTRY_LENGTH } from "@/lib/constants";

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
    logger.error("entries.update", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
