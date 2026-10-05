"use client";

import dynamic from "next/dynamic";

/** 3D spatial map streams in on demand; prefetching happens below the fold. */
export const SpatialCampusMap = dynamic(
  () => import("@/components/map/SpatialCampusMap").then((m) => m.SpatialCampusMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[480px] w-full items-center justify-center rounded-3xl border border-border/40 bg-muted/30"
        role="status"
        aria-label="Loading the campus map"
      >
        <span className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    ),
  }
);
