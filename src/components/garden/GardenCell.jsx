import { useNavigate } from "react-router-dom";
import DoodleIcon from "@/components/doodles/DoodleIcon.jsx";

export default function GardenCell({ dateKey, state, doodleId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (state === "future") return;
    navigate(`/journal/${dateKey}`);
  };

  if (state === "filled" && doodleId) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="garden-cell"
        aria-label={`View entry for ${dateKey}`}
      >
        <DoodleIcon doodleId={doodleId} size={28} />
      </button>
    );
  }

  if (state === "today") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="garden-cell"
        aria-label="Write today's entry"
      >
        <div className="garden-dot-today" />
      </button>
    );
  }

  if (state === "future") {
    return (
      <div className="garden-cell garden-cell-future">
        <div className="garden-dot-future" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="garden-cell garden-cell-empty"
      aria-label={`View ${dateKey}`}
    >
      <div className="garden-dot" />
    </button>
  );
}
