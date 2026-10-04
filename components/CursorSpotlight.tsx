"use client";

import { useEffect, useRef } from "react";

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  decay: number;
  angle: number;
}

/**
 * Subtle Liquid Cursor — only active while moving, silent when still.
 * Renders a soft radial glow that fades out after the pointer stops,
 * plus gentle elliptical ripples while in motion. No idle animation.
 * Adapts to light/dark themes via CSS variables.
 */
export default function LiquidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let rafId = 0;
    let isRunning = true;

    // Pointer state
    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      prevX: -9999,
      prevY: -9999,
      visible: false,       // cursor entered viewport
      moving: false,        // has velocity above threshold
      fadeAlpha: 0,         // smooth fade in/out of glow
    };

    const ripples: WaterRipple[] = [];
    let lastSpawnTime = 0;
    let lastMoveTime = 0;

    // Read theme colors from CSS variables
    const getThemeColors = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains("dark");
      
      if (isDark) {
        return {
          rippleColor: rootStyles.getPropertyValue("--primary").trim() || "oklch(0.72 0.10 160)",
          glowColor: rootStyles.getPropertyValue("--primary").trim() || "oklch(0.72 0.10 160)",
          rippleAlpha: 0.35,
          glowAlpha: 0.15,
        };
      } else {
        return {
          rippleColor: rootStyles.getPropertyValue("--primary").trim() || "oklch(0.42 0.11 160)",
          glowColor: rootStyles.getPropertyValue("--primary").trim() || "oklch(0.42 0.11 160)",
          rippleAlpha: 0.25,
          glowAlpha: 0.1,
        };
      }
    };

    // Parse OKLCH color string to RGB for canvas
    const oklchToRgb = (oklch: string): [number, number, number] => {
      // Simple fallback - extract hue and use HSL approximation
      // For production, consider a proper OKLCH parser
      const match = oklch.match(/oklch\([\d.]+\s+[\d.]+\s+(\d+)\)/);
      const hue = match ? parseInt(match[1]) : 160;
      // Convert HSL to RGB (simplified)
      const h = hue / 360;
      const s = 0.6;
      const l = 0.5;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h * 6) % 2 - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;
      if (h < 1/6) { r = c; g = x; b = 0; }
      else if (h < 2/6) { r = x; g = c; b = 0; }
      else if (h < 3/6) { r = 0; g = c; b = x; }
      else if (h < 4/6) { r = 0; g = x; b = c; }
      else if (h < 5/6) { r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      if (!pointer.visible) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.prevX = e.clientX;
        pointer.prevY = e.clientY;
        pointer.visible = true;
      }
      lastMoveTime = performance.now();
    };

    const onMouseLeave = () => {
      pointer.visible = false;
      pointer.moving = false;
      pointer.targetX = -9999;
      pointer.targetY = -9999;
    };

    const tick = (time: number) => {
      if (!isRunning) return;

      // Smooth interpolation
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x += (pointer.targetX - pointer.x) * 0.18;
      pointer.y += (pointer.targetY - pointer.y) * 0.18;

      const vx = pointer.x - pointer.prevX;
      const vy = pointer.y - pointer.prevY;
      const velocity = Math.hypot(vx, vy);

      // Consider "moving" when velocity > 0.5 px/frame — eliminates micro-jitter
      const MOVING_THRESHOLD = 0.5;
      // After last mouse event, stay "moving" for a short grace period
      // so the glow doesn't flicker during brief hesitations
      const MOVING_GRACE_MS = 180;
      const timeSinceMove = time - lastMoveTime;
      pointer.moving = velocity > MOVING_THRESHOLD || (pointer.visible && timeSinceMove < MOVING_GRACE_MS);

      // Fade glow alpha: ramp up when moving, decay when still
      if (pointer.moving && pointer.visible) {
        pointer.fadeAlpha = Math.min(1, pointer.fadeAlpha + 0.12);
      } else {
        pointer.fadeAlpha = Math.max(0, pointer.fadeAlpha - 0.04);
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Nothing to draw if fully faded
      if (pointer.fadeAlpha <= 0.005 && ripples.length === 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const colors = getThemeColors();
      const [r, g, b] = oklchToRgb(colors.glowColor);
      const angle = Math.atan2(vy, vx);

      // Spawn ripples only while actively moving
      if (pointer.moving && pointer.visible && pointer.x > 0 && pointer.y > 0) {
        const timeSinceLast = time - lastSpawnTime;
        const distMoved = Math.hypot(pointer.x - pointer.prevX, pointer.y - pointer.prevY);

        // Tighter spawn cadence: only when meaningful movement detected
        if (distMoved > 5 && timeSinceLast > 55) {
          ripples.push({
            x: pointer.x,
            y: pointer.y,
            radius: 3,
            maxRadius: Math.min(22 + velocity * 1.8, 44),
            life: 1.0,
            decay: 0.028,
            angle,
          });
          lastSpawnTime = time;

          if (ripples.length > 14) ripples.shift();
        }
      }

      // Render ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.life -= rip.decay;
        rip.radius += (rip.maxRadius - rip.radius) * 0.1;

        if (rip.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        const alpha = rip.life * colors.rippleAlpha;

        ctx.beginPath();
        ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.7, rip.angle, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Cursor glow — only when alpha > 0
      if (pointer.fadeAlpha > 0.005 && pointer.x > 0 && pointer.y > 0) {
        const a = pointer.fadeAlpha;
        const glowRadius = 22;
        const grad = ctx.createRadialGradient(
          pointer.x, pointer.y, 0,
          pointer.x, pointer.y, glowRadius
        );

        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${colors.glowAlpha * a})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${colors.glowAlpha * 0.3 * a})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}