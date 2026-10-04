"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  color?: string;
  intensity?: number;
  disabled?: boolean;
}

export function SpotlightCard({
  children,
  className,
  radius = 300,
  color = "currentColor",
  intensity = 0.15,
  disabled = false,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || disabled) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/50",
          className
        )}
      >
        {children}
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute z-0 inset-0"
        style={{
          maskImage: isHovering
            ? `radial-gradient(${radius}px circle at ${mousePos.x}px ${mousePos.y}px, white, transparent 70%)`
            : "none",
          backgroundColor: color,
          opacity: isHovering ? intensity : 0,
          transition: "opacity 0.3s ease-out",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: number;
  angle?: number;
  disabled?: boolean;
}

export function GlareCard({
  children,
  className,
  color = "rgba(255,255,255,0.1)",
  intensity = 0.6,
  angle = 45,
  disabled = false,
}: GlareCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || disabled) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/50",
          className
        )}
      >
        {children}
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/50",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute z-0 inset-0"
        style={{
          background: isHovering
            ? `linear-gradient(${angle}deg, transparent 30%, ${color} 50%, transparent 70%)`
            : "transparent",
          backgroundSize: "200% 200%",
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.4s ease-out, background-position 0.6s ease-out",
        }}
        animate={{
          backgroundPosition: isHovering ? "200% 200%" : "0% 0%",
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}