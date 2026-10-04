"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function PageTransition({
  children,
  className,
  mode = "fade-slide",
}: {
  children: React.ReactNode;
  className?: string;
  mode?: "fade" | "slide" | "fade-slide" | "scale" | "none";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const key = pathname + (searchParams?.toString() || "");

  if (shouldReduceMotion || mode === "none") {
    return <div className={cn(className)}>{children}</div>;
  }

  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
    },
    "fade-slide": {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -16 },
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
    },
    scale: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.96 },
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const transition = transitions[mode];

  return (
    <motion.div
      key={key}
      initial={transition.initial}
      animate={transition.animate}
      exit={transition.exit}
      transition={transition.transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function ViewTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      style={{ viewTransitionName: "page-content" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SharedLayoutTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      layout
      layoutId="shared"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}