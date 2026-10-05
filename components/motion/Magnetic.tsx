"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import * as React from "react";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  maxDistance?: number;
  radius?: number;
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: unknown;
}

export function Magnetic({
  children,
  className,
  strength = 0.4,
  maxDistance = 80,
  radius = 120,
  disabled = false,
  onClick,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || disabled) {
    return (
      <div ref={ref} className={cn(className)} onClick={onClick}>
        {children}
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const { clientX, clientY } = e;

    // Outside the magnetic field radius the surface stays put.
    const distFromCenter = Math.hypot(clientX - (left + width / 2), clientY - (top + height / 2));
    if (distFromCenter > radius) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    let x = (clientX - (left + width / 2)) * strength;
    let y = (clientY - (top + height / 2)) * strength;

    const distance = Math.hypot(x, y);
    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      x *= scale;
      y *= scale;
    }

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
      style={{ transformOrigin: "center" }}
    >
      <div className={cn("relative z-10 transition-all duration-200", isHovering && "shadow-lg shadow-primary/20")}>
        {children}
      </div>
      <motion.div
        className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0"
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

interface MagneticButtonProps extends MagneticProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  as?: React.ElementType;
  type?: "button" | "submit" | "reset";
  href?: string;
  [key: string]: unknown;
}

export function MagneticButton({
  children,
  className,
  variant = "default",
  size = "default",
  strength = 0.3,
  maxDistance = 60,
  as: Component = "button",
  type = "button",
  href,
  ...props
}: MagneticButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  const sizeStyles = {
    default: "min-h-11 px-5 py-2",
    sm: "min-h-9 rounded-md px-3",
    lg: "min-h-12 rounded-md px-8",
    icon: "min-h-11 min-w-11",
  };

  return (
    <Magnetic
      strength={strength}
      maxDistance={maxDistance}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {React.createElement(
        Component,
        {
          className: cn(sizeStyles[size], className),
          type,
          href,
          ...props,
        },
        children
      )}
    </Magnetic>
  );
}