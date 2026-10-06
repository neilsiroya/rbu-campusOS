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
  demand?: boolean;
}

const DEFAULT_CAMERA: Required<NonNullable<ImmersiveCanvasProps["camera"]>> = {
  position: [0, 0, 5],
  fov: 45,
  near: 0.1,
  far: 1000,
};

export function ImmersiveCanvas({
  children,
  className,
  style,
  camera = DEFAULT_CAMERA,
  fallback,
  sceneName = "CampusOS Spatial Scene",
  demand = false,
}: ImmersiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { dpr, tier, webglSupported, reducedMotion, postprocessingEnabled } = useAdaptiveQuality();
  const { isPaused } = useVisibilityPause(containerRef);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const showFallback = tier === "fallback" || !webglSupported;

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        style={style}
        className={cn(
          "relative w-full h-full min-h-[200px] overflow-hidden rounded-3xl bg-card/40 loading-preserve",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  if (showFallback) {
    return (
      <div
        ref={containerRef}
        style={style}
        className={cn("relative w-full h-full", className)}
        role="img"
        aria-label={`${sceneName}: 2D fallback presentation`}
      >
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
    <div
      ref={containerRef}
      style={style}
      className={cn("relative w-full h-full overflow-hidden", className)}
    >
      <SceneErrorBoundary fallback={fallback} sceneName={sceneName}>
        <Canvas
          key={`${sceneName}-${tier}-${reducedMotion ? "rm" : "std"}`}
          camera={{ ...DEFAULT_CAMERA, ...camera }}
          dpr={dpr}
          frameloop={isPaused ? "never" : demand || reducedMotion ? "demand" : "always"}
          gl={{
            antialias: tier !== "low",
            alpha: true,
            powerPreference: reducedMotion ? "default" : "high-performance",
            depth: true,
            stencil: false,
            preserveDrawingBuffer: false,
          }}
          flat={!postprocessingEnabled}
          className="w-full h-full touch-none"
        >
          {children}
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
