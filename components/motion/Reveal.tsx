"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 20,
  x = 0,
  opacity = 0,
  scale = 1,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity, y, x, scale }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerDelay?: number;
}

export function StaggerReveal({
  children,
  className,
  delayChildren = 0,
  staggerDelay = 0.08,
}: StaggerRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{React.Children.map(children, (child) => child)}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={cn(className)}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              custom: index,
              variants: {
                hidden: { opacity: 0, y: 20, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1] as const,
                  },
                },
              },
            })
          : child
      )}
    </motion.div>
  );
}

export function RevealText({
  children,
  className,
  delay = 0,
  duration = 0.5,
  splitBy = "words",
}: {
  children: string | React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  splitBy?: "chars" | "words" | "lines";
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || typeof children !== "string") {
    return <p className={cn(className)}>{children}</p>;
  }

  const splitFn =
    splitBy === "chars"
      ? (str: string) => str.split("")
      : splitBy === "words"
      ? (str: string) => str.split(" ")
      : (str: string) => str.split("\n");

  const parts = splitFn(children);

  return (
    <div className={cn("inline-flex flex-wrap")}>
      {parts.map((part, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: splitBy === "chars" ? 0 : 0.5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: delay + index * (splitBy === "chars" ? 0.02 : 0.05),
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          style={{
            display: "inline-block",
            ...(splitBy === "words" && { marginRight: "0.25em" }),
            ...(splitBy === "lines" && { width: "100%" }),
          }}
        >
          {part}
          {splitBy === "words" && " "}
        </motion.span>
      ))}
    </div>
  );
}

interface CountUpProps {
  value: number;
  className?: string;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
}

export function CountUp({
  value,
  className,
  duration = 1.5,
  delay = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
}: CountUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setCount(value);
      return;
    }

    const startTime = performance.now();
    const frame = (now: number) => {
      const elapsed = (now - startTime - delay * 1000) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(value * eased);
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);
  }, [value, duration, delay, shouldReduceMotion]);

  const displayValue = format
    ? format(count)
    : count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span className={cn(className)}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

interface BlurTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  blurStart?: number;
  blurEnd?: number;
}

export function BlurText({
  children,
  className,
  delay = 0,
  duration = 0.6,
  blurStart = 12,
  blurEnd = 0,
}: BlurTextProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <p className={cn(className)}>{children}</p>;
  }

  return (
    <motion.span
      initial={{ filter: `blur(${blurStart}px)`, opacity: 0 }}
      animate={{ filter: `blur(${blurEnd}px)`, opacity: 1 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn(className)}
    >
      {children}
    </motion.span>
  );
}