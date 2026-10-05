"use client";

import { create } from "zustand";

export type OSMode = "normal" | "focus" | "immersive";

export type QualityTier = "high" | "medium" | "low" | "fallback";

interface OSState {
  mode: OSMode;
  setMode: (mode: OSMode) => void;
  toggleMode: () => void;
  isFocusMode: boolean;
  isImmersiveMode: boolean;
  qualityTier: QualityTier;
  setQualityTier: (tier: QualityTier) => void;
  spatialViewResetTrigger: number;
  triggerSpatialReset: () => void;
  activeCoreDataMetric: "academic" | "connectivity" | "events" | "workload";
  setActiveCoreDataMetric: (metric: "academic" | "connectivity" | "events" | "workload") => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  mode: "normal",
  setMode: (mode: OSMode) =>
    set({
      mode,
      isFocusMode: mode === "focus",
      isImmersiveMode: mode === "immersive",
    }),
  toggleMode: () => {
    const current = get().mode;
    const next: OSMode = current === "normal" ? "immersive" : current === "immersive" ? "focus" : "normal";
    set({
      mode: next,
      isFocusMode: next === "focus",
      isImmersiveMode: next === "immersive",
    });
  },
  isFocusMode: false,
  isImmersiveMode: false,
  qualityTier: "high",
  setQualityTier: (tier: QualityTier) => set({ qualityTier: tier }),
  spatialViewResetTrigger: 0,
  triggerSpatialReset: () =>
    set((state) => ({ spatialViewResetTrigger: state.spatialViewResetTrigger + 1 })),
  activeCoreDataMetric: "academic",
  setActiveCoreDataMetric: (metric) => set({ activeCoreDataMetric: metric }),
}));
