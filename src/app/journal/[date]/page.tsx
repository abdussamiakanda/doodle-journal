"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJournal } from "@/hooks/useJournal";
import { isValidDateKey, isToday, isFuture, formatDisplayDate } from "@/lib/dates";
import Card from "@/components/ui/Card";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalEditor from "@/components/journal/JournalEditor";
import EntryDisplay from "@/components/journal/EntryDisplay";
import Button from "@/components/ui/Button";

export default function JournalPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, getEntry } = useJournal();
  const [editMode, setEditMode] = useState(false);

  const dateKey = params.date as string;

  if (!isValidDateKey(dateKey)) {
    return (
      <main className="min-h-screen flex items-center justify-center page-enter">
        <Card className="max-w-md mx-auto text-center">
          <p className="font-display text-xl text-garden-ink mb-4">
            Invalid date
          </p>
          <Button onClick={() => router.push("/")}>
            Back to Garden
          </Button>
        </Card>
      </main>
    );
  }

  if (isFuture(dateKey)) {
    return (
      <main className="min-h-screen flex items-center justify-center page-enter">
        <Card className="max-w-md mx-auto text-center">
          <p className="font-display text-xl text-garden-ink mb-4">
            This day hasn&apos;t arrived yet!
          </p>
          <p className="text-garden-ink/50 mb-4">
            Come back on {formatDisplayDate(dateKey)}
          </p>
          <Button onClick={() => router.push("/")}>
            Back to Garden
          </Button>
        </Card>
      </main>
    );
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-display text-2xl text-garden-cream/50">Loading...</p>
      </main>
    );
  }

  const entry = getEntry(dateKey);
  const todayEntry = isToday(dateKey);

  const showEditor =
    (todayEntry && !entry) ||
    (todayEntry && entry && editMode);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 page-enter">
      <Card className="w-full max-w-lg">
        <JournalHeader dateKey={dateKey} doodleId={entry?.doodleId} />

        {showEditor ? (
          <JournalEditor dateKey={dateKey} onCancel={editMode ? () => setEditMode(false) : undefined} />
        ) : entry ? (
          <EntryDisplay entry={entry} onEdit={() => setEditMode(true)} />
        ) : (
          <div className="text-center py-8">
            <p className="font-display text-xl text-garden-ink/50 mb-4">
              No memory recorded for this day
            </p>
            <Button variant="ghost" onClick={() => router.push("/")}>
              Back to Garden
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
