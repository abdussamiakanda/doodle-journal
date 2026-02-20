import { formatDisplayDate } from "@/lib/dates.js";
import DoodleIcon from "@/components/doodles/DoodleIcon.jsx";

export default function JournalHeader({ dateKey, doodleId }) {
  return (
    <div className="journal-header-wrap">
      {doodleId && (
        <div className="journal-doodle-wrap">
          <DoodleIcon doodleId={doodleId} size={64} />
        </div>
      )}
      <h2 className="journal-date">{formatDisplayDate(dateKey)}</h2>
    </div>
  );
}
