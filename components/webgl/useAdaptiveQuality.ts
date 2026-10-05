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
  webglSupported: boolean;
  isLowPower: boolean;
}

function detectReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function detectMobile(width: number): boolean {
  if (typeof window === "undefined") return false;
  return width < 768 || window.matchMedia("(pointer: coarse)").matches;
}

function detectLowPower(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 4 || memory <= 4;
}

function detectWebGL(): { hasWebGL2: boolean; webglSupported: boolean } {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { hasWebGL2: false, webglSupported: false };
  }
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
  return { hasWebGL2, webglSupported };
}

function deriveBaseTier(width: number, isMobile: boolean, hasWebGL2: boolean, webglSupported: boolean, isLowPower: boolean): QualityTier {
  if (!webglSupported) return "fallback";
  if (isMobile || width < 1024 || !hasWebGL2) return "low";
  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
  return cores >= 6 && !isLowPower ? "high" : "medium";
}

function demoteForReducedMotion(baseTier: QualityTier, reducedMotion: boolean): QualityTier {
  if (!reducedMotion) return baseTier;
  if (baseTier === "high") return "medium";
  if (baseTier === "medium") return "low";
  if (baseTier === "low") return "low";
  return "fallback";
}

export function computeQuality(width: number | null): QualityConfig {
  const w = width ?? (typeof window !== "undefined" ? window.innerWidth : 1440);
  const reducedMotion = detectReducedMotion();
  const isMobile = detectMobile(w);
  const isLowPower = detectLowPower();
  const { hasWebGL2, webglSupported } = detectWebGL();

  const baseTier = deriveBaseTier(w, isMobile, hasWebGL2, webglSupported, isLowPower);
  const tier = demoteForReducedMotion(baseTier, reducedMotion);

  const dpr =
    tier === "high" ? Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2) :
    tier === "medium" ? Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1.5) :
    1;

  const postprocessingEnabled = tier === "high" && !isMobile && !reducedMotion;
  const particleCount =
    tier === "high" ? 160 :
    tier === "medium" ? 80 :
    tier === "low" ? 30 :
    0;

  return {
    tier,
    dpr,
    postprocessingEnabled,
    particleCount,
    isMobile,
    reducedMotion,
    hasWebGL2,
    webglSupported,
    isLowPower,
  };
}

export function useAdaptiveQuality(): QualityConfig {
  const [config, setConfig] = useState<QualityConfig>(() => computeQuality(null));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setConfig(computeQuality(window.innerWidth));
    update();

    const handleResize = () => update();
    window.addEventListener("resize", handleResize, { passive: true });

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreference = () => update();
    if (mq.addEventListener) {
      mq.addEventListener("change", handleMotionPreference);
    } else {
      mq.addListener(handleMotionPreference);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handleMotionPreference);
      } else {
        mq.removeListener(handleMotionPreference);
      }
    };
  }, []);

  return config;
}
