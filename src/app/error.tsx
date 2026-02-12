"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-garden-bg p-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-garden-cream mb-4">
          Something went wrong
        </h1>
        <p className="text-garden-cream/70 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
