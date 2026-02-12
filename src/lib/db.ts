import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { validateEnv } from "./env";

let db: Database.Database | null = null;
let initPromise: Promise<Database.Database> | null = null;

export function getDb(): Database.Database {
  // Return existing connection immediately
  if (db) return db;

  // Validate environment variables on first database access
  const env = validateEnv();

  // Synchronous initialization for first call
  // This is safe in Node.js single-threaded event loop
  const dbPath = path.resolve(process.cwd(), env.databasePath);

  // Ensure the directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  initSchema(db);

  return db;
}

// Async initialization for explicit use cases
export async function getDbAsync(): Promise<Database.Database> {
  if (db) return db;

  if (!initPromise) {
    initPromise = new Promise((resolve) => {
      resolve(getDb());
    });
  }

  return initPromise;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      token_version INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS entries (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id),
      date_key   TEXT NOT NULL,
      text       TEXT NOT NULL,
      doodle_id  INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, date_key)
    );

    CREATE INDEX IF NOT EXISTS idx_entries_user_year
      ON entries(user_id, date_key);
  `);

  // Migration: Add token_version column if it doesn't exist
  try {
    db.exec("ALTER TABLE users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0");
  } catch {
    // Column already exists, ignore
  }
}
