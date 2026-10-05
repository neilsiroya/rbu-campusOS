"use client";

import React, { useRef, useState, useEffect, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { useAdaptiveQuality } from "./useAdaptiveQuality";
import { useVisibilityPause } from "./useVisibilityPause";
import { cn } from "@/lib/utils";

interface ImmersiveCanvasProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
  fallback?: ReactNode;
  sceneName?: string;
}

export function ImmersiveCanvas({
  children,
  className,
  style,
  camera = { position: [0, 0, 5], fov: 45, near: 0.1, far: 1000 },
  fallback,
  sceneName = "CampusOS Spatial Scene",
}: ImmersiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { dpr, tier, reducedMotion, hasWebGL2 } = useAdaptiveQuality();
  const isVisible = useVisibilityPause(containerRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        style={style}
        className={cn("relative w-full h-full min-h-[200px] overflow-hidden rounded-3xl bg-card/40 animate-pulse", className)}
        aria-hidden="true"
      />
    );
  }

  // If user prefers reduced motion or device lacks WebGL2, render accessible fallback
  if (tier === "fallback" || reducedMotion || !hasWebGL2) {
    return (
      <div ref={containerRef} style={style} className={cn("relative w-full h-full", className)}>
        {fallback || (
          <div className="flex h-full min-h-[220px] w-full items-center justify-center rounded-3xl border border-border/80 bg-gradient-to-br from-card/80 via-background to-card/60 p-6 text-center">
            <div>
              <p className="text-sm font-semibold text-foreground">{sceneName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Optimized 2D presentation active.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={style} className={cn("relative w-full h-full overflow-hidden", className)}>
      <SceneErrorBoundary fallback={fallback} sceneName={sceneName}>
        <Canvas
          camera={camera}
          dpr={dpr}
          frameloop={isVisible ? "always" : "never"}
          gl={{
            antialias: tier !== "low",
            alpha: true,
            powerPreference: "high-performance",
            depth: true,
            stencil: false,
          }}
          className="w-full h-full"
        >
          {children}
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
