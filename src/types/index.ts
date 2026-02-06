export type DateKey = string; // "YYYY-MM-DD"
export type DoodleId = number; // 1-50 (expandable)

export interface JournalEntry {
  dateKey: DateKey;
  text: string;
  doodleId: DoodleId;
  createdAt: string; // ISO timestamp
  updatedAt: string;
}

export interface JournalStore {
  version: 1;
  year: number;
  entries: Record<DateKey, JournalEntry>;
  usedDoodleIds: DoodleId[];
}

export interface DoodleDef {
  id: DoodleId;
  category: "plant" | "flower" | "leaf" | "mushroom" | "insect" | "tree";
  viewBox: string;
  paths: string[];
}

export type CellState = "empty" | "today" | "filled" | "future";
