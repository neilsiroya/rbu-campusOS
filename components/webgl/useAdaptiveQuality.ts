"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { type QualityTier } from "@/lib/os-store";

export function useAdaptiveQuality() {
  const prefersReduced = useReducedMotion();
  const [tier, setTier] = useState<QualityTier>("high");
  const [dpr, setDpr] = useState<number>(1.5);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    // 1. Detect WebGL2 support
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) {
        setWebglSupported(false);
        setTier("fallback");
        return;
      }
    } catch {
      setWebglSupported(false);
      setTier("fallback");
      return;
    }

    // 2. Reduced motion overrides
    if (prefersReduced) {
      setTier("low");
      setDpr(1);
      return;
    }

    // 3. Hardware heuristics (device memory, cores, screen size)
    const devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
    const hardwareConcurrency = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;

    if (isMobile || hardwareConcurrency <= 2) {
      setTier("medium");
      setDpr(Math.min(devicePixelRatio, 1.25));
    } else {
      setTier("high");
      setDpr(Math.min(devicePixelRatio, 2));
    }
  }, [prefersReduced]);

  return {
    tier,
    dpr,
    webglSupported,
    isLowPower: tier === "low" || tier === "fallback",
    isHigh: tier === "high",
  };
}
