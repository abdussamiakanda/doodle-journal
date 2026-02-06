"use client";

import { useRouter } from "next/navigation";
import { CellState, DateKey, DoodleId } from "@/types";
import DoodleIcon from "@/components/doodles/DoodleIcon";

interface GardenCellProps {
  dateKey: DateKey;
  state: CellState;
  doodleId?: DoodleId;
  isNew?: boolean;
}

export default function GardenCell({
  dateKey,
  state,
  doodleId,
  isNew = false,
}: GardenCellProps) {
  const router = useRouter();

  const handleClick = () => {
    if (state === "future") return;
    router.push(`/journal/${dateKey}`);
  };

  if (state === "filled" && doodleId) {
    return (
      <button
        onClick={handleClick}
        className="garden-cell w-full aspect-square"
        aria-label={`View entry for ${dateKey}`}
      >
        <DoodleIcon
          doodleId={doodleId}
          size={28}
          color="#1A1A4E"
          animate={isNew}
        />
      </button>
    );
  }

  if (state === "today") {
    return (
      <button
        onClick={handleClick}
        className="garden-cell w-full aspect-square"
        aria-label="Write today's entry"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-garden-accent animate-pulse-dot" />
      </button>
    );
  }

  if (state === "future") {
    return (
      <div className="garden-cell garden-cell-future w-full aspect-square">
        <div className="w-1.5 h-1.5 rounded-full bg-garden-dot-future" />
      </div>
    );
  }

  // Empty (past, no entry)
  return (
    <button
      onClick={handleClick}
      className="garden-cell garden-cell-empty w-full aspect-square"
      aria-label={`View ${dateKey}`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-garden-dot-empty" />
    </button>
  );
}
