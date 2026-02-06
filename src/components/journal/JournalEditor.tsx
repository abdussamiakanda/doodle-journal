"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DateKey } from "@/types";
import { useJournal } from "@/hooks/useJournal";
import { MAX_ENTRY_LENGTH } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface JournalEditorProps {
  dateKey: DateKey;
  onCancel?: () => void;
}

export default function JournalEditor({ dateKey, onCancel }: JournalEditorProps) {
  const router = useRouter();
  const { getEntry, addEntry, updateEntry, refetch } = useJournal();
  const existing = getEntry(dateKey);

  const [text, setText] = useState(existing?.text ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!existing;
  const hasChanges = text.trim() !== (existing?.text ?? "");
  const canSave = text.trim().length > 0 && hasChanges;

  const handleSave = useCallback(async () => {
    if (!canSave) return;
    setIsSaving(true);

    try {
      if (isEditing) {
        await updateEntry(dateKey, text.trim());
      } else {
        await addEntry(dateKey, text.trim());
      }

      // Refetch store from server to ensure garden grid has fresh data
      await refetch();

      if (onCancel) {
        onCancel();
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Failed to save entry:", err);
      setIsSaving(false);
    }
  }, [canSave, isEditing, dateKey, text, updateEntry, addEntry, refetch, router, onCancel]);

  const handleBack = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/");
    }
  }, [router, onCancel]);

  return (
    <div>
      <textarea
        className="journal-textarea"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_ENTRY_LENGTH))}
        placeholder="What happened today?"
        maxLength={MAX_ENTRY_LENGTH}
        autoFocus
      />

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-garden-ink/40">
          {text.length}/{MAX_ENTRY_LENGTH}
        </span>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleBack}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave || isSaving}
          >
            {isEditing ? "Update" : "Done"}
          </Button>
        </div>
      </div>
    </div>
  );
}
