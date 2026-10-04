"use client";

import { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CampusBackgroundProps {
  className?: string;
  lightMode?: boolean;
}

export function CampusBackground({ className, lightMode = false }: CampusBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Sync with next-themes
  useEffect(() => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    const observer = new MutationObserver(() => {
      setTheme(html.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (shouldReduceMotion) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-[-1] pointer-events-none",
          theme === "dark" ? "bg-background" : "bg-background",
          className
        )}
      />
    );
  }

  return (
    <div className={cn("fixed inset-0 z-[-1] pointer-events-none overflow-hidden", className)}>
      {/* Layer 1: Semantic Canvas - Base gradient */}
      <div
        className={cn(
          "absolute inset-0",
          theme === "dark"
            ? "bg-[radial-gradient(ellipse_at_center,_var(--background)_0%,_oklch(0.08_0.03_240)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,_var(--background)_0%,_oklch(0.98_0.005_250)_100%)]"
        )}
      />

      {/* Layer 2: Environmental Texture - Subtle noise + gradients */}
      <EnvironmentalTexture theme={theme} />

      {/* Layer 3: Interaction Layer - Aurora responds to cursor */}
      {!lightMode && <AuroraLayer theme={theme} />}
    </div>
  );
}

function EnvironmentalTexture({ theme }: { theme: "light" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle gradient mesh
      const gradient1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.1,
        0,
        width * 0.2,
        height * 0.1,
        Math.max(width, height) * 0.6
      );
      if (theme === "dark") {
        gradient1.addColorStop(0, "rgba(82, 82, 255, 0.03)");
        gradient1.addColorStop(0.5, "rgba(124, 255, 103, 0.015)");
        gradient1.addColorStop(1, "transparent");
      } else {
        gradient1.addColorStop(0, "rgba(82, 82, 255, 0.02)");
        gradient1.addColorStop(0.5, "rgba(124, 255, 103, 0.008)");
        gradient1.addColorStop(1, "transparent");
      }

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      // Second gradient
      const gradient2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.9,
        0,
        width * 0.8,
        height * 0.9,
        Math.max(width, height) * 0.5
      );
      if (theme === "dark") {
        gradient2.addColorStop(0, "rgba(124, 255, 103, 0.02)");
        gradient2.addColorStop(1, "transparent");
      } else {
        gradient2.addColorStop(0, "rgba(124, 255, 103, 0.015)");
        gradient2.addColorStop(1, "transparent");
      }

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Very subtle noise overlay (every 3rd frame for performance)
      frame++;
      if (frame % 3 === 0) {
        const imageData = ctx.createImageData(
          Math.min(512, canvas.width),
          Math.min(512, canvas.height)
        );
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const value = (Math.random() - 0.5) * 4;
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
          data[i + 3] = theme === "dark" ? 3 : 2;
        }
        ctx.putImageData(imageData, 0, 0);
        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = 0.03;
        ctx.drawImage(
          canvas,
          0,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          width,
          height
        );
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
    };

    const loop = () => {
      draw();
      requestAnimationFrame(loop);
    };

    resize();
    loop();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: "crisp-edges" }}
      aria-hidden="true"
    />
  );
}

function AuroraLayer({ theme }: { theme: "light" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let time = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const mouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const loop = () => {
      time += 0.008;

      ctx.clearRect(0, 0, width, height);

      // Aurora parameters based on theme
      const amplitude = theme === "dark" ? 1.0 : 0.6;
      const blend = theme === "dark" ? 0.5 : 0.35;

      // Color stops
      const colors = theme === "dark"
        ? [
            [0.2, 0.2, 1.0],    // #3333ff
            [0.48, 1.0, 0.4],   // #7cff67
            [0.2, 0.2, 1.0],    // #3333ff
          ]
        : [
            [0.32, 0.15, 1.0],  // lighter purple
            [0.48, 1.0, 0.4],   // same green
            [0.32, 0.15, 1.0],
          ];

      // Draw 3 overlapping aurora waves
      for (let wave = 0; wave < 3; wave++) {
        const waveOffset = wave * 0.33;
        const phase = time * 0.5 + waveOffset;

        const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        colors.forEach((c, i) => {
          const pos = i / (colors.length - 1);
          gradient.addColorStop(
            pos,
            `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, ${0.15 * amplitude})`
          );
        });

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(0, window.innerHeight);

        for (let x = 0; x <= window.innerWidth; x += 5) {
          const uvX = (x / window.innerWidth) * 2 + phase * 0.1;
          const uvY = time * 0.25;

          // Simplex noise approximation
          let height = 0;
          for (let octave = 0; octave < 4; octave++) {
            const freq = Math.pow(2, octave);
            const amp = Math.pow(0.5, octave);
            const nx = uvX * freq;
            const ny = uvY * freq;
            const n = Math.sin(nx * 12.9898 + ny * 78.233) * 43758.5453;
            height += amp * (n - Math.floor(n)) * 2 - 1;
          }

          const mouseInfluence = Math.max(
            0,
            1 - Math.hypot(mouseRef.current.x - x, mouseRef.current.y - (window.innerHeight * 0.5)) / 400
          );

          height = Math.exp(height * 0.5 * amplitude + mouseInfluence * 0.3);
          const y = window.innerHeight * 0.6 - height * window.innerHeight * 0.3;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(window.innerWidth, window.innerHeight);
        ctx.lineTo(0, window.innerHeight);
        ctx.closePath();
        ctx.fill();
      }

      // Mouse glow
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx > 0 && mx < width && my > 0 && my < height) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        if (theme === "dark") {
          glow.addColorStop(0, "rgba(82, 82, 255, 0.08)");
          glow.addColorStop(0.5, "rgba(124, 255, 103, 0.03)");
        } else {
          glow.addColorStop(0, "rgba(82, 82, 255, 0.04)");
          glow.addColorStop(0.5, "rgba(124, 255, 103, 0.015)");
        }
        glow.addColorStop(1, "transparent");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mx, my, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", mouseMove);
    resize();
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}