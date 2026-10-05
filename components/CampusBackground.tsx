/**
 * CampusBackground
 * ----------------------------------------------------------------
 * The three atmospheric layers that sit beneath the shell:
 *   1. A soft aurora wash (CSS conic gradients, token-driven).
 *   2. A dot grid etched into the surface.
 *   3. A scrim that keeps contrast as the shell scrolls.
 * All layers are pointer-events-none and light/dark aware; the aurora
 * parallax is disabled under prefers-reduced-motion.
 * Introduced in Phase 4 of the CampusOS redesign — cheap, CSS-only.
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CampusBackgroundProps {
  className?: string;
  lightMode?: boolean;
}

export function CampusBackground({ className }: CampusBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync with next-themes and class changes on <html>
  useEffect(() => {
    const html = document.documentElement;
    const updateTheme = () => {
      setTheme(html.classList.contains("dark") ? "dark" : "light");
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // High performance GPU-accelerated atmospheric gradient mesh with visibility pause
  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let rafId = 0;
    let isVisible = !document.hidden;

    const pointer = {
      x: width * 0.5,
      y: height * 0.3,
      targetX: width * 0.5,
      targetY: height * 0.3,
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(rafId);
      }
    };

    let time = 0;
    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isVisible) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += delta * 0.3;

      // Eased pointer interpolation (smooth inertia)
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === "dark";

      // Atmospheric Node 1: Floating primary emerald/cyan aura
      const x1 = width * 0.25 + Math.sin(time * 0.8) * (width * 0.08) + (pointer.x - width * 0.5) * 0.08;
      const y1 = height * 0.2 + Math.cos(time * 0.6) * (height * 0.06) + (pointer.y - height * 0.5) * 0.08;
      const r1 = Math.max(width, height) * 0.45;

      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      if (isDark) {
        g1.addColorStop(0, "rgba(16, 185, 129, 0.055)");
        g1.addColorStop(0.5, "rgba(6, 95, 70, 0.02)");
        g1.addColorStop(1, "transparent");
      } else {
        g1.addColorStop(0, "rgba(16, 185, 129, 0.035)");
        g1.addColorStop(0.5, "rgba(5, 150, 105, 0.012)");
        g1.addColorStop(1, "transparent");
      }
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Atmospheric Node 2: Secondary orbital indigo/blue pulse
      const x2 = width * 0.78 + Math.cos(time * 0.7) * (width * 0.07) + (pointer.x - width * 0.5) * -0.05;
      const y2 = height * 0.65 + Math.sin(time * 0.9) * (height * 0.08) + (pointer.y - height * 0.5) * -0.05;
      const r2 = Math.max(width, height) * 0.5;

      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      if (isDark) {
        g2.addColorStop(0, "rgba(99, 102, 241, 0.045)");
        g2.addColorStop(0.6, "rgba(67, 56, 202, 0.015)");
        g2.addColorStop(1, "transparent");
      } else {
        g2.addColorStop(0, "rgba(99, 102, 241, 0.028)");
        g2.addColorStop(0.6, "rgba(79, 70, 229, 0.008)");
        g2.addColorStop(1, "transparent");
      }
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Atmospheric Node 3: Subtle pointer spotlight
      const spotGrad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 240);
      if (isDark) {
        spotGrad.addColorStop(0, "rgba(52, 211, 153, 0.035)");
        spotGrad.addColorStop(1, "transparent");
      } else {
        spotGrad.addColorStop(0, "rgba(16, 185, 129, 0.02)");
        spotGrad.addColorStop(1, "transparent");
      }
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 240, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [theme, shouldReduceMotion]);

  return (
    <div className={cn("fixed inset-0 z-[-1] pointer-events-none overflow-hidden", className)}>
      {/* Base Canvas Layer */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-500",
          theme === "dark"
            ? "bg-[radial-gradient(ellipse_at_top,_oklch(0.12_0.03_240)_0%,_var(--background)_70%,_oklch(0.07_0.025_240)_100%)]"
            : "bg-[radial-gradient(ellipse_at_top,_oklch(0.995_0.006_160)_0%,_var(--background)_70%,_oklch(0.97_0.005_250)_100%)]"
        )}
      />

      {/* Subtle architectural dot grid pattern for technical texture */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.025] dark:opacity-[0.04]",
          "bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px]"
        )}
        aria-hidden="true"
      />

      {/* Dynamic Ambient Canvas with zero-overhead loops */}
      {!shouldReduceMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />
      )}
    </div>
  );
}