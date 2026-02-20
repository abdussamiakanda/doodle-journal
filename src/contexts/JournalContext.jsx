import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase.js";
import { getCurrentYear } from "@/lib/dates.js";
import { getRandomUnusedDoodleId } from "@/lib/doodle-pool.js";
import { useAuth } from "./AuthContext.jsx";

function rowToEntry(row) {
  return {
    dateKey: row.date_key,
    text: row.text,
    doodleId: row.doodle_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const JournalContext = createContext(null);

export function JournalProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [store, setStore] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchEntries = useCallback(async (uid) => {
    if (!supabase || !uid) return;
    const year = getCurrentYear();
    const { data: rows, error } = await supabase
      .from("entries")
      .select("id, user_id, date_key, text, doodle_id, created_at, updated_at")
      .eq("user_id", uid)
      .like("date_key", `${year}-%`)
      .order("date_key");
    if (error) {
      console.error("Failed to load entries:", error);
      setStore({ version: 1, year, entries: {}, usedDoodleIds: [] });
    } else {
      const entries = {};
      const usedDoodleIds = [];
      for (const row of rows || []) {
        entries[row.date_key] = rowToEntry(row);
        usedDoodleIds.push(row.doodle_id);
      }
      setStore({ version: 1, year, entries, usedDoodleIds });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (userId) fetchEntries(userId);
    else {
      setStore(null);
      setIsLoaded(true);
    }
  }, [userId, fetchEntries]);

  const getEntry = useCallback(
    (dateKey) => store?.entries[dateKey],
    [store]
  );

  const hasEntry = useCallback(
    (dateKey) => !!store?.entries[dateKey],
    [store]
  );

  const addEntry = useCallback(
    async (dateKey, text) => {
      if (!supabase || !userId) throw new Error("Not authenticated");
      const { data: existing } = await supabase
        .from("entries")
        .select("id")
        .eq("user_id", userId)
        .eq("date_key", dateKey)
        .maybeSingle();
      if (existing) throw new Error("Entry already exists for this date");
      // Use in-memory usedDoodleIds when available to avoid an extra request
      const usedIds = store?.usedDoodleIds ?? [];
      const doodleId = getRandomUnusedDoodleId(usedIds);
      const { data: row, error } = await supabase
        .from("entries")
        .insert({ user_id: userId, date_key: dateKey, text: text.trim(), doodle_id: doodleId })
        .select()
        .single();
      if (error) {
        throw new Error(error.message || "Failed to save entry");
      }
      const entry = rowToEntry(row);
      setStore((prev) =>
        prev
          ? {
              ...prev,
              entries: { ...prev.entries, [dateKey]: entry },
              usedDoodleIds: [...prev.usedDoodleIds, doodleId],
            }
          : prev
      );
      return entry;
    },
    [userId, store?.usedDoodleIds]
  );

  const updateEntry = useCallback(
    async (dateKey, text) => {
      if (!supabase || !userId) throw new Error("Not authenticated");
      // Docs: update() + filters (eq) + select() to return the updated row
      const { data: row, error } = await supabase
        .from("entries")
        .update({ text: text.trim(), updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("date_key", dateKey)
        .select("id, user_id, date_key, text, doodle_id, created_at, updated_at")
        .maybeSingle();
      if (error) throw new Error(error.message || "Failed to update entry");
      if (!row) throw new Error("Entry not found");
      const entry = rowToEntry(row);
      setStore((prev) =>
        prev
          ? { ...prev, entries: { ...prev.entries, [dateKey]: entry } }
          : prev
      );
      return entry;
    },
    [userId]
  );

  const value = {
    store,
    isLoaded,
    getEntry,
    hasEntry,
    addEntry,
    updateEntry,
    getAllEntries: () => store?.entries ?? {},
    refetch: () => userId && fetchEntries(userId),
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error("useJournal must be used within JournalProvider");
  return ctx;
}
