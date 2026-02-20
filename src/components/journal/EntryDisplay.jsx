import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button.jsx";

export default function EntryDisplay({ entry, onEdit }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="journal-textarea" style={{ whiteSpace: "pre-wrap", minHeight: "120px" }}>
        {entry.text}
      </div>
      <div className="journal-actions" style={{ justifyContent: "flex-end" }}>
        <div className="journal-buttons">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>Edit</Button>
          )}
        </div>
      </div>
    </div>
  );
}
