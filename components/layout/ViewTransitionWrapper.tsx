"use client";

import { useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface ViewTransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ViewTransitionWrapper({ children, className }: ViewTransitionWrapperProps) {
  // Layout boundary; the provider controls workspace entrance and focus.
  return (
    <div className={className}>
      {children}
    </div>
  );
}

// Shared element transition component for elements that should animate between pages.
//
// The wrapper has to stay a real box for `view-transition-name` to apply, so
// callers must pass the layout classes the wrapper needs. Defaults keep the
// wrapper shrink-to-fit; AppShell opts into `flex-1` for the content column.
export function SharedElement({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div style={{ viewTransitionName: id }} className={className}>
      {children}
    </div>
  );
}

// Hook to programmatically trigger view transitions
export function useViewTransition() {
  const shouldReduceMotion = useReducedMotion();

  const startTransition = useCallback((callback: () => Promise<void> | void) => {
    if (shouldReduceMotion || !document.startViewTransition) {
      return Promise.resolve(callback());
    }

    const transition = document.startViewTransition(callback);
    return transition.finished;
  }, [shouldReduceMotion]);

  return { startTransition };
}
