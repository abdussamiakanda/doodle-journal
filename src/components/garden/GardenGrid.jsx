import { useEffect, useRef } from "react";
import { useJournal } from "@/contexts/JournalContext.jsx";
import { getYearDates, getCurrentYear, isToday, isFuture } from "@/lib/dates.js";
import GardenCell from "./GardenCell.jsx";
import YearHeader from "./YearHeader.jsx";
import Card from "@/components/ui/Card.jsx";
import Loading from "@/components/ui/Loading.jsx";

function getCellState(hasEntry, dateKey) {
  if (hasEntry(dateKey)) return "filled";
  if (isToday(dateKey)) return "today";
  if (isFuture(dateKey)) return "future";
  return "empty";
}

export default function GardenGrid() {
  const { store, isLoaded, hasEntry, getEntry } = useJournal();
  const todayRef = useRef(null);
  const year = getCurrentYear();
  const dates = getYearDates(year);

  useEffect(() => {
    if (isLoaded && todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoaded]);

  const entryCount = store ? Object.keys(store.entries).length : 0;

  if (!isLoaded) {
    return <Loading message="Loading your garden..." />;
  }

  return (
    <div className="garden-wrap page-enter">
      <YearHeader year={year} entryCount={entryCount} />
      <Card className="garden-scroll">
        <div className="garden-grid">
          {dates.map((dateKey, index) => {
            const state = getCellState(hasEntry, dateKey);
            const entry = getEntry(dateKey);
            const isTodayCell = isToday(dateKey);
            return (
              <div
                key={dateKey}
                ref={isTodayCell ? todayRef : undefined}
                style={{ "--cell-index": index }}
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
        <p className="year-count" style={{ textAlign: "center", marginTop: "1.5rem" }}>
          Tap today&apos;s glowing dot to plant your first memory
        </p>
      )}
    </div>
  );
}
