import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useJournal } from "@/contexts/JournalContext.jsx";
import { MAX_ENTRY_LENGTH } from "@/lib/constants.js";
import Button from "@/components/ui/Button.jsx";

export default function JournalEditor({ dateKey, onCancel }) {
  const navigate = useNavigate();
  const { getEntry, addEntry, updateEntry } = useJournal();
  const existing = getEntry(dateKey);

  const [text, setText] = useState(existing?.text ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const isEditing = !!existing;
  const hasChanges = text.trim() !== (existing?.text ?? "");
  const canSave = text.trim().length > 0 && hasChanges;

  const handleDone = useCallback(async () => {
    if (!canSave) {
      if (onCancel) onCancel();
      else navigate("/");
      return;
    }
    setSaveError(null);
    setIsSaving(true);
    const SAVE_TIMEOUT_MS = 35000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Save timed out. In Supabase Dashboard, check your project is not paused (click Restore if it is). The first request after resuming can take 20–30 seconds—wait and try again."
            )
          ),
        SAVE_TIMEOUT_MS
      )
    );
    try {
      if (isEditing) {
        await Promise.race([updateEntry(dateKey, text.trim()), timeoutPromise]);
      } else {
        await Promise.race([addEntry(dateKey, text.trim()), timeoutPromise]);
      }
      // No refetch: addEntry/updateEntry already update React state
      if (onCancel) onCancel();
      else navigate("/");
    } catch (err) {
      const message = err?.message || err?.error_description || "Failed to save. Try again.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }, [canSave, isEditing, dateKey, text, updateEntry, addEntry, navigate, onCancel]);

  const handleBack = useCallback(() => {
    if (onCancel) onCancel();
    else navigate("/");
  }, [navigate, onCancel]);

  return (
    <div>
      <label htmlFor="journal-entry" className="sr-only">
        Journal entry text
      </label>
      <textarea
        id="journal-entry"
        className="journal-textarea"
        value={text}
        onChange={(e) => {
          setText(e.target.value.slice(0, MAX_ENTRY_LENGTH));
          setSaveError(null);
        }}
        placeholder="What happened today?"
        maxLength={MAX_ENTRY_LENGTH}
        autoFocus
        aria-describedby="char-count"
      />
      {saveError && (
        <p className="form-error" role="alert">
          {saveError}
        </p>
      )}
      <div className="journal-actions">
        <span id="char-count" className="journal-char-count" aria-live="polite">
          {text.length}/{MAX_ENTRY_LENGTH}
        </span>
        <div className="journal-buttons">
          <Button variant="ghost" onClick={handleBack}>
            Cancel
          </Button>
          <Button onClick={handleDone} disabled={isSaving}>
            {isEditing ? "Update" : "Done"}
          </Button>
        </div>
      </div>
    </div>
  );
}
