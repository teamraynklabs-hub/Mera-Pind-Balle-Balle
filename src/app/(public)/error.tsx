"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <AlertTriangle size={48} className="text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        An unexpected error occurred. Please try again or go back to the
        homepage.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="default">
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </main>
  );
}
