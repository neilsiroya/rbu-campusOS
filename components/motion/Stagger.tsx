"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerDelay?: number;
  direction?: "vertical" | "horizontal";
}

export function StaggerContainer({
  children,
  className,
  delayChildren = 0,
  staggerDelay = 0.08,
  direction = "vertical",
}: StaggerContainerProps) {
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
                hidden: {
                  opacity: 0,
                  ...(direction === "vertical"
                    ? { y: 20 }
                    : { x: direction === "horizontal" ? 20 : -20 }),
                  scale: 0.98,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  x: 0,
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

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerItem({
  children,
  className,
  delay = 0,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as const,
            delay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerText({
  children,
  className,
  delay = 0,
  duration = 0.5,
  splitBy = "words",
}: {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitBy?: "chars" | "words" | "lines";
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || typeof children !== "string") {
    return <p className={className}>{children}</p>;
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