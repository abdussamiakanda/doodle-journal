import { useAuth } from "@/contexts/AuthContext.jsx";
import Button from "@/components/ui/Button.jsx";

export default function YearHeader({ year, entryCount }) {
  const { user, logout } = useAuth();
  return (
    <div className="year-header">
      <h1 className="year-title">{year}</h1>
      <div className="year-meta">
        <p className="year-count">
          {entryCount} {entryCount === 1 ? "memory" : "memories"}
        </p>
        {user && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => logout()}
            aria-label="Log out"
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}
