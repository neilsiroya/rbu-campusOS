"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

/**
 * Lazy-loaded version of the CampusCore 3D component.
 *
 * Three.js + @react-three/fiber weigh well over a megabyte of JS before
 * gzip. Splitting them off of the initial page chunk keeps the landing and
 * dashboard routes interactive on first paint; the 3D layer then streams in
 * while a lightweight skeleton holds the layout.
 */
export const CampusCore = dynamic(
  () => import("@/components/immersive/CampusCore").then((m) => m.CampusCore),
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          "flex min-h-[440px] w-full items-center justify-center rounded-3xl border border-border/40 bg-muted/30 p-8"
        )}
        role="status"
        aria-label="Warming up the spatial core"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-xs font-medium">Syncing the spatial core…</p>
        </div>
      </div>
    ),
  }
);
