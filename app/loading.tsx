import { BrandMark } from "@/components/os/BrandMark";

/**
 * Route-level loading state. Brief by design — the application
 * shell must become usable immediately; heavy WebGL islands stream
 * in asynchronously after this resolves.
 */
export default function Loading() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-5" role="status" aria-label="CampusOS is loading">
        <div className="relative">
          <div className="size-12 animate-ping rounded-2xl bg-primary/10" />
          <div className="absolute inset-0 flex size-12 items-center justify-center">
            <BrandMark compact />
          </div>
        </div>
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Booting CampusOS
        </p>
      </div>
      <span className="sr-only">Loading…</span>
    </main>
  );
}
