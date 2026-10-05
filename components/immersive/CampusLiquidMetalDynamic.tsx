"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-loaded LiquidMetal shader panel. Kept out of the critical bundle so
 * the Campus AI chat surface stays usable on low-end devices while the WebGL
 * material compiles.
 */
export const CampusLiquidMetal = dynamic(
  () => import("@/components/immersive/CampusLiquidMetal").then((m) => m.CampusLiquidMetal),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[320px] w-full items-center justify-center rounded-3xl border border-border/40 bg-muted/30"
        role="status"
        aria-label="Loading the neural surface"
      >
        <span className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    ),
  }
);
