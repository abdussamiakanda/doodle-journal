import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJournal } from "@/contexts/JournalContext.jsx";
import {
  isValidDateKey,
  isToday,
  isFuture,
  formatDisplayDate,
} from "@/lib/dates.js";
import Card from "@/components/ui/Card.jsx";
import JournalHeader from "@/components/journal/JournalHeader.jsx";
import JournalEditor from "@/components/journal/JournalEditor.jsx";
import EntryDisplay from "@/components/journal/EntryDisplay.jsx";
import Button from "@/components/ui/Button.jsx";
import Loading from "@/components/ui/Loading.jsx";

export default function JournalPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { isLoaded, getEntry } = useJournal();
  const [editMode, setEditMode] = useState(false);

  const dateKey = params.date;

  if (!isValidDateKey(dateKey)) {
    return (
      <main className="journal-page page-enter">
        <Card className="journal-card journal-empty">
          <p className="text-ink">Invalid date</p>
          <Button onClick={() => navigate("/")}>Back to Garden</Button>
        </Card>
      </main>
    );
  }

  if (isFuture(dateKey)) {
    return (
      <main className="journal-page page-enter">
        <Card className="journal-card journal-empty">
          <p className="text-ink">This day hasn&apos;t arrived yet!</p>
          <p className="text-ink-muted" style={{ marginBottom: "1rem" }}>
            Come back on {formatDisplayDate(dateKey)}
          </p>
          <Button onClick={() => navigate("/")}>Back to Garden</Button>
        </Card>
      </main>
    );
  }

  if (!isLoaded) {
    return (
      <main className="page">
        <Loading message="Loading entry..." />
      </main>
    );
  }

  const entry = getEntry(dateKey);
  const todayEntry = isToday(dateKey);
  const showEditor =
    (todayEntry && !entry) || (entry && editMode);

  return (
    <main className="journal-page page-enter">
      <Card className="journal-card">
        <JournalHeader dateKey={dateKey} doodleId={entry?.doodleId} />
        {showEditor ? (
          <JournalEditor
            dateKey={dateKey}
            onCancel={editMode ? () => setEditMode(false) : undefined}
          />
        ) : entry ? (
          <EntryDisplay entry={entry} onEdit={() => setEditMode(true)} />
        ) : (
          <div className="journal-empty">
            <p className="text-ink-muted">No memory recorded for this day</p>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Back to Garden
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
