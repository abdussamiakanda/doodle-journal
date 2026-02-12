"use client";

import { useEffect, useRef } from "react";
import { useJournal } from "@/hooks/useJournal";
import { getYearDates, getCurrentYear, getToday, isToday, isFuture } from "@/lib/dates";
import { CellState, DateKey } from "@/types";
import GardenCell from "./GardenCell";
import YearHeader from "./YearHeader";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";

export default function GardenGrid() {
  const { store, isLoaded, hasEntry, getEntry } = useJournal();
  const todayRef = useRef<HTMLDivElement>(null);
  const year = getCurrentYear();
  const dates = getYearDates(year);
  const today = getToday();

  useEffect(() => {
    if (isLoaded && todayRef.current) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isLoaded]);

  function getCellState(dateKey: DateKey): CellState {
    if (hasEntry(dateKey)) return "filled";
    if (isToday(dateKey)) return "today";
    if (isFuture(dateKey)) return "future";
    return "empty";
  }

  const entryCount = store ? Object.keys(store.entries).length : 0;

  if (!isLoaded) {
    return <Loading message="Loading your garden..." />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6">
      <YearHeader year={year} entryCount={entryCount} />

      <Card className="garden-scroll overflow-y-auto max-h-[80vh]">
        <div className="grid grid-cols-garden-sm md:grid-cols-garden-md lg:grid-cols-garden-lg gap-1">
          {dates.map((dateKey) => {
            const state = getCellState(dateKey);
            const entry = getEntry(dateKey);
            const isTodayCell = isToday(dateKey);

            return (
              <div
                key={dateKey}
                ref={isTodayCell ? todayRef : undefined}
              >
                <GardenCell
                  dateKey={dateKey}
                  state={state}
                  doodleId={entry?.doodleId}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {entryCount === 0 && (
        <p className="text-center font-display text-xl text-garden-cream/50 mt-6">
          Tap today&apos;s glowing dot to plant your first memory
        </p>
      )}
    </div>
  );
}
