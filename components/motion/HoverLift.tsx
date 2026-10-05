"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  lift?: number;
  shadow?: "sm" | "md" | "lg" | "xl";
  scale?: number;
  borderGlow?: boolean;
  borderGlowColor?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function HoverLift({
  children,
  className,
  lift = 4,
  shadow = "md",
  scale = 1,
  borderGlow = false,
  borderGlowColor = "var(--primary)",
  disabled = false,
  onClick,
}: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion();

  const shadows = {
    sm: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    md: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    lg: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    xl: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  };

  if (shouldReduceMotion || disabled) {
    return (
      <div
        className={cn(
          "transition-all duration-200",
          borderGlow && "border-border/50",
          className
        )}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      whileHover={{
        y: -lift,
        scale,
        boxShadow: shadow ? shadows[shadow] : undefined,
        borderColor: borderGlow ? borderGlowColor : undefined,
        borderWidth: borderGlow ? 1 : undefined,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
      onClick={onClick}
    >
      <div className={cn("relative transition-all duration-200")}>
        {children}
      </div>
    </motion.div>
  );
}

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "featured" | "subtle" | "glass";
  lift?: boolean;
  glow?: boolean;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export function InteractiveCard({
  children,
  className,
  variant = "default",
  lift = true,
  glow = false,
  onClick,
  href,
  disabled = false,
}: InteractiveCardProps) {
  const variantStyles = {
    default: "bg-card border border-border",
    featured: "bg-card border border-border shadow-xl",
    subtle: "bg-background/50 border border-border/50",
    glass: "glass-strong border border-border/50",
  };

  const baseStyles = cn(
    "relative rounded-xl overflow-hidden transition-all duration-200",
    variantStyles[variant],
    className
  );

  if (disabled) {
    return <div className={baseStyles} onClick={onClick}>{children}</div>;
  }

  const InteractiveWrapper = () => (
    <motion.div
      className={baseStyles}
      whileHover={{
        y: lift ? -4 : 0,
        boxShadow: lift ? "0 20px 40px -10px rgb(0 0 0 / 0.15)" : undefined,
        borderColor: glow ? "var(--primary)" : undefined,
        borderWidth: glow ? 1 : undefined,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
      onClick={onClick}
    >
      <div className={cn("relative transition-all duration-200")}>
        {children}
      </div>
      {glow && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );

  if (href) {
    return <a href={href}>{React.createElement(InteractiveWrapper)}</a>;
  }

  return <InteractiveWrapper />;
}