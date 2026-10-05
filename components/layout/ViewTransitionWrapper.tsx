"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface ViewTransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ViewTransitionWrapper({ children, className }: ViewTransitionWrapperProps) {
  // This component just provides the shared element transition context
  // The actual view transition is handled by ViewTransitionProvider
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

  const startTransition = useRef((callback: () => Promise<void> | void) => {
    if (shouldReduceMotion || !document.startViewTransition) {
      callback();
      return Promise.resolve();
    }

    const transition = document.startViewTransition(callback);
    return transition.finished;
  });

  return { startTransition: startTransition.current };
}