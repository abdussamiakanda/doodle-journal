"use client";

import { formatDisplayDate } from "@/lib/dates";
import { DateKey } from "@/types";
import DoodleIcon from "@/components/doodles/DoodleIcon";

interface JournalHeaderProps {
  dateKey: DateKey;
  doodleId?: number;
}

export default function JournalHeader({ dateKey, doodleId }: JournalHeaderProps) {
  return (
    <div className="text-center mb-6">
      {doodleId && (
        <div className="flex justify-center mb-3">
          <DoodleIcon doodleId={doodleId} size={64} color="#1A1A4E" />
        </div>
      )}
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-garden-ink">
        {formatDisplayDate(dateKey)}
      </h2>
    </div>
  );
}
