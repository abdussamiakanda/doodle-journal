"use client";

import { useRouter } from "next/navigation";
import { JournalEntry } from "@/types";
import { isToday } from "@/lib/dates";
import Button from "@/components/ui/Button";

interface EntryDisplayProps {
  entry: JournalEntry;
  onEdit?: () => void;
}

export default function EntryDisplay({ entry, onEdit }: EntryDisplayProps) {
  const router = useRouter();
  const canEdit = isToday(entry.dateKey);

  return (
    <div>
      <div className="journal-textarea whitespace-pre-wrap !min-h-[120px]">
        {entry.text}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="ghost" onClick={() => router.push("/")}>
          Back
        </Button>
        {canEdit && onEdit && (
          <Button onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
