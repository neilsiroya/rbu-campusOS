"use client";

/**
 * CanvasRevealEffect
 * ---------------------------------------------------------------------------
 * Dot-grid overlay that lights up around the pointer (or viewport center when
 * idle) with an eased falloff. Used as a decorative layer inside hover
 * spotlight cards (see `components/ui/card-spotlight.tsx`).
 *
 * Performance contract:
 *  - Single `requestAnimationFrame` loop, torn down on unmount.
 *  - Static dot grid is drawn once into an offscreen-friendly canvas; only the
 *    pointer glow is repainted per frame.
 *  - Fully respects `prefers-reduced-motion` (renders one static frame).
 *  - Pauses when the document is hidden.
 *  - Device pixel ratio is capped at 2 to protect fill-rate on 3x phones.
 */

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type CanvasRevealEffectColor = [number, number, number];

export interface CanvasRevealEffectProps {
  /** Dot spacing in CSS pixels. */
  dotSize?: number;
  /** Dot diameter as a multiplier of `dotSize` (1 = fills the cell). */
  dotSizeScale?: number;
  /** Pointer falloff radius in CSS pixels. */
  radius?: number;
  /** Color cycles used for the pointer glow tint. */
  colors?: CanvasRevealEffectColor[];
  /** Animation speed multiplier. Higher = faster color cycling. */
  animationSpeed?: number;
  /** Extra class for the positioning wrapper. */
  containerClassName?: string;
  /** Extra class for the `<canvas>` element. */
  className?: string;
}

const DEFAULTS = {
  dotSize: 30,
  dotSizeScale: 1.7,
  radius: 320,
  colors: [
    [255, 255, 255],
    [148, 184, 255],
  ] as CanvasRevealEffectColor[],
  animationSpeed: 3,
} as const;

/** Parse `#rrggbb` / `#rgb` / `rgb(a)` strings into an RGB tuple. */
function parseColor(input: string): CanvasRevealEffectColor {
  const value = input.trim();

  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex;
    if (full.length >= 6) {
      return [
        parseInt(full.slice(0, 2), 16),
        parseInt(full.slice(2, 4), 16),
        parseInt(full.slice(4, 6), 16),
      ];
    }
  }

  const match = value.match(/(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})/);
  if (match) {
    return [
      Math.min(255, Number(match[1])),
      Math.min(255, Number(match[2])),
      Math.min(255, Number(match[3])),
    ];
  }

  return [255, 255, 255];
}

/** Read a CSS custom property (e.g. `--foreground`) as an RGB tuple. */
function readToken(token: string, fallback: CanvasRevealEffectColor): CanvasRevealEffectColor {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!raw) return fallback;
  return parseColor(raw.startsWith("#") || raw.includes("(") ? raw : raw);
}

export function CanvasRevealEffect({
  dotSize = DEFAULTS.dotSize,
  dotSizeScale = DEFAULTS.dotSizeScale,
  radius = DEFAULTS.radius,
  colors = DEFAULTS.colors,
  animationSpeed = DEFAULTS.animationSpeed,
  containerClassName,
  className,
}: CanvasRevealEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);

  const palette = useCallback((): CanvasRevealEffectColor[] => {
    if (!colors?.length) return [...DEFAULTS.colors];
    return colors;
  }, [colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rgb = palette();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let start = performance.now();
    let raf = 0;

    const dotRadius = (dotSize * dotSizeScale) / 2;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointerRef.current = pointerRef.current ?? { x: width / 2, y: height / 2 };
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      // Static base grid — faint neutral dots.
      ctx.fillStyle = "rgba(148, 163, 184, 0.18)";
      for (let x = 0; x < width; x += dotSize) {
        for (let y = 0; y < height; y += dotSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawGlow = (elapsed: number) => {
      const pointer = pointerRef.current ?? { x: width / 2, y: height / 2 };
      const cycle = (Math.sin((elapsed / 1000) * animationSpeed) + 1) / 2;

      for (let x = 0; x < width; x += dotSize) {
        for (let y = 0; y < height; y += dotSize) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist > radius) continue;

          const falloff = 1 - dist / radius;
          const eased = falloff * falloff;

          const [r, g, b] = rgb[Math.floor(cycle * rgb.length) % rgb.length];
          const alpha = 0.15 + eased * 0.65;

          ctx.beginPath();
          ctx.arc(x, y, dotRadius * (0.45 + eased * 0.55), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawGlow(now - start);

      if (!reduceMotion) {
        raf = window.requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (reduceMotion && raf === 0) {
        start = performance.now();
        frame(performance.now());
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) window.cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reduceMotion) {
        start = performance.now();
        raf = window.requestAnimationFrame(frame);
      }
    };

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
        resize();
        if (reduceMotion) frame(performance.now());
      }) : null;

    resize();
    drawGrid();
    observer?.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    start = performance.now();
    raf = reduceMotion ? 0 : window.requestAnimationFrame(frame);
    if (reduceMotion) frame(performance.now());

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer?.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // `colors` is normalised through `palette` so a new inline array literal
    // does not thrash the loop on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dotSize, dotSizeScale, radius, animationSpeed, palette]);

  return (
    <div className={cn("pointer-events-none absolute inset-0", containerClassName)} aria-hidden="true">
      <canvas ref={canvasRef} className={cn("size-full", className)} />
    </div>
  );
}

export default CanvasRevealEffect;

/** Utility re-export so callers can pass CSS var names as colors. */
export const cssColor = (tokenOrColor: string, fallback = "rgba(255,255,255,1)"): string =>
  typeof window === "undefined" ? fallback : readToken(tokenOrColor, parseColor(fallback)).join(",");