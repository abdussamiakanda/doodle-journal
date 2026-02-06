"use client";

import {
  createContext,
  useContext,
  useCallback,
  createElement,
  type ReactNode,
} from "react";
import { DateKey, JournalEntry, JournalStore } from "@/types";
import { useStorage } from "./useStorage";
import { api } from "@/lib/api";

interface JournalContextValue {
  store: JournalStore | null;
  isLoaded: boolean;
  getEntry: (dateKey: DateKey) => JournalEntry | undefined;
  addEntry: (dateKey: DateKey, text: string) => Promise<JournalEntry>;
  updateEntry: (dateKey: DateKey, text: string) => Promise<JournalEntry>;
  getAllEntries: () => Record<DateKey, JournalEntry>;
  hasEntry: (dateKey: DateKey) => boolean;
  refetch: () => Promise<void>;
}

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const { store, isLoaded, updateStore, refetch } = useStorage();

  const getEntry = useCallback(
    (dateKey: DateKey): JournalEntry | undefined => {
      return store?.entries[dateKey];
    },
    [store]
  );

  const hasEntry = useCallback(
    (dateKey: DateKey): boolean => {
      return !!store?.entries[dateKey];
    },
    [store]
  );

  const addEntry = useCallback(
    async (dateKey: DateKey, text: string): Promise<JournalEntry> => {
      const entry = await api.createEntry(dateKey, text);

      updateStore((prev) => ({
        ...prev,
        entries: { ...prev.entries, [dateKey]: entry },
        usedDoodleIds: [...prev.usedDoodleIds, entry.doodleId],
      }));

      return entry;
    },
    [updateStore]
  );

  const updateEntry = useCallback(
    async (dateKey: DateKey, text: string): Promise<JournalEntry> => {
      const entry = await api.updateEntry(dateKey, text);

      updateStore((prev) => ({
        ...prev,
        entries: { ...prev.entries, [dateKey]: entry },
      }));

      return entry;
    },
    [updateStore]
  );

  const getAllEntries = useCallback((): Record<DateKey, JournalEntry> => {
    return store?.entries ?? {};
  }, [store?.entries]);

  const value: JournalContextValue = {
    store,
    isLoaded,
    getEntry,
    addEntry,
    updateEntry,
    getAllEntries,
    hasEntry,
    refetch,
  };

  return createElement(JournalContext.Provider, { value }, children);
}

export function useJournal(): JournalContextValue {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
}
