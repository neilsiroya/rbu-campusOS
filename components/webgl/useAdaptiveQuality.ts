"use client";

import { useState, useEffect } from "react";

export type QualityTier = "high" | "medium" | "low" | "fallback";

export interface QualityConfig {
  tier: QualityTier;
  dpr: number;
  postprocessingEnabled: boolean;
  particleCount: number;
  isMobile: boolean;
  reducedMotion: boolean;
  hasWebGL2: boolean;
  /** True when either WebGL1 or WebGL2 contexts can be created. */
  webglSupported: boolean;
  /** True when the device looks weak (few cores / low memory / coarse pointer). */
  isLowPower: boolean;
}

export function useAdaptiveQuality(): QualityConfig {
  const [config, setConfig] = useState<QualityConfig>({
    tier: "medium",
    dpr: 1,
    postprocessingEnabled: false,
    particleCount: 60,
    isMobile: false,
    reducedMotion: false,
    hasWebGL2: true,
    webglSupported: true,
    isLowPower: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const isLowPower = cores <= 4 || memory <= 4;

    // Check WebGL2 support (WebGL1 is still enough for the fallback tiers)
    let hasWebGL2 = false;
    let webglSupported = false;
    try {
      const testCanvas = document.createElement("canvas");
      hasWebGL2 = !!(window.WebGL2RenderingContext && testCanvas.getContext("webgl2"));
      webglSupported = hasWebGL2 || !!testCanvas.getContext("webgl");
    } catch {
      hasWebGL2 = false;
      webglSupported = false;
    }

    // Determine tier
    let tier: QualityTier = "high";
    if (!webglSupported || reducedMotion) {
      tier = "fallback";
    } else if (!hasWebGL2 || isMobile || window.innerWidth < 1024) {
      tier = "low";
    } else {
      tier = cores >= 6 && !isLowPower ? "high" : "medium";
    }

    const dpr = tier === "high" ? Math.min(window.devicePixelRatio || 1, 2) : tier === "medium" ? 1.5 : 1;
    const postprocessingEnabled = tier === "high" && !isMobile;
    const particleCount = tier === "high" ? 160 : tier === "medium" ? 80 : 30;

    setConfig({
      tier,
      dpr,
      postprocessingEnabled,
      particleCount,
      isMobile,
      reducedMotion,
      hasWebGL2,
      webglSupported,
      isLowPower,
    });
  }, []);

  return config;
}
