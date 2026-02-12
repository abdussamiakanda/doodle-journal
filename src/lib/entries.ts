/**
 * Shared utilities for journal entries
 */

import { JournalEntry, DateKey, DoodleId } from "@/types";

export interface EntryRow {
  id: number;
  user_id: number;
  date_key: string;
  text: string;
  doodle_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * Convert a database row to a JournalEntry object
 */
export function rowToEntry(row: EntryRow): JournalEntry {
  return {
    dateKey: row.date_key as DateKey,
    text: row.text,
    doodleId: row.doodle_id as DoodleId,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
