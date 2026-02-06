"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JournalStore } from "@/types";
import { api } from "@/lib/api";
import { getCurrentYear } from "@/lib/dates";

export function useStorage() {
  const [store, setStore] = useState<JournalStore | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const fetchIdRef = useRef(0);

  const fetchEntries = useCallback(async () => {
    const id = ++fetchIdRef.current;
    const year = getCurrentYear();
    try {
      const data = await api.getEntries(year);
      // Only apply if this is the latest fetch
      if (id === fetchIdRef.current) {
        setStore({
          version: 1,
          year,
          entries: data.entries,
          usedDoodleIds: data.usedDoodleIds,
        });
        setIsLoaded(true);
      }
    } catch (err) {
      console.error("Failed to load entries:", err);
      if (id === fetchIdRef.current) {
        setIsLoaded(true);
      }
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const updateStore = useCallback(
    (updater: (prev: JournalStore) => JournalStore) => {
      setStore((prev) => {
        if (!prev) return prev;
        return updater(prev);
      });
    },
    []
  );

  return { store, isLoaded, updateStore, refetch: fetchEntries };
}
