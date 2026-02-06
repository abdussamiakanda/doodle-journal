"use client";

import { useAuth } from "@/hooks/useAuth";

interface YearHeaderProps {
  year: number;
  entryCount: number;
}

export default function YearHeader({ year, entryCount }: YearHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-garden-cream">
        {year}
      </h1>
      <div className="flex items-center gap-4">
        <p className="font-display text-lg text-garden-cream/60">
          {entryCount} {entryCount === 1 ? "memory" : "memories"}
        </p>
        {user && (
          <button
            onClick={logout}
            className="font-body text-sm text-garden-cream/40 hover:text-garden-cream/70 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
