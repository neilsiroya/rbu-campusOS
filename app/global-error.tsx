"use client";

/**
 * Root-level error boundary. Runs outside the root layout, so it
 * must render its own <html>/<body>. Used when the root layout
 * itself throws (e.g. a provider failure).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center bg-background px-6 py-16 text-center text-foreground">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          RBU CampusOS
        </p>
        <h1 className="mt-4 font-display text-3xl font-black tracking-tight">
          The operating system needs a restart.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Something failed while booting CampusOS. Your session is safe —
          try reloading.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Reload CampusOS
        </button>
      </body>
    </html>
  );
}
