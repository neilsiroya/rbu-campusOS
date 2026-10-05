"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/os/BrandMark";

/**
 * Route-level error boundary. Replaces the default white screen
 * with a branded, recoverable state. `error`/`reset` come from
 * the App Router contract.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure to the operator console; never expose it
    // to the user.
    console.error("[CampusOS] route error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <BrandMark href="/" showTagline />

      <p className="mt-14 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="mt-4 max-w-xl font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        This surface hit a snag.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Your session and data are intact. Reload the surface, or head
        back to the dashboard if the problem persists.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={reset}
          size="lg"
          className="h-11 rounded-full px-6"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try Again
        </Button>
        <Button
          render={<a href="/dashboard" />}
          variant="outline"
          size="lg"
          className="h-11 rounded-full px-6"
        >
          Back to Dashboard
        </Button>
      </div>

      {error.digest ? (
        <p className="mt-10 font-mono text-[10px] text-muted-foreground/60">
          Reference: {error.digest}
        </p>
      ) : null}
    </main>
  );
}
