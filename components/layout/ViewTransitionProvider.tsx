"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export function ViewTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const viewTransitionRef = useRef<ViewTransition | null>(null);

  // Track navigation direction for forward/back animations
  const pathHistoryRef = useRef<string[]>([]);
  const currentIndexRef = useRef(-1);

  useEffect(() => {
    // NOTE: intentionally NOT using useSearchParams() here. That hook forces
    // the entire app shell into a Suspense bailout, which hung hydration in
    // dev (blank page behind a never-resolving S:0 boundary). The query
    // string is only needed client-side, so read it from window instead.
    const key = pathname + window.location.search;
    
    // On first load, initialize history
    if (currentIndexRef.current === -1) {
      pathHistoryRef.current = [key];
      currentIndexRef.current = 0;
      return;
    }

    const lastKey = pathHistoryRef.current[currentIndexRef.current];
    
    if (key === lastKey) return; // Same page, no navigation

    // Check if going forward or back
    const existingIndex = pathHistoryRef.current.indexOf(key);
    let direction: "forward" | "back" | "new" = "new";

    if (existingIndex !== -1) {
      direction = existingIndex < currentIndexRef.current ? "back" : "forward";
      currentIndexRef.current = existingIndex;
    } else {
      // New page - truncate forward history and add
      pathHistoryRef.current = pathHistoryRef.current.slice(0, currentIndexRef.current + 1);
      pathHistoryRef.current.push(key);
      currentIndexRef.current = pathHistoryRef.current.length - 1;
      direction = "forward";
    }

    // Set direction on document for CSS
    document.documentElement.setAttribute("data-vt-direction", direction);

    // Use native View Transitions API if available
    if (!shouldReduceMotion && document.startViewTransition) {
      setIsTransitioning(true);
      
      const transition = document.startViewTransition(async () => {
        // The actual navigation will happen via Next.js
        // We just need to wait for the DOM to update
      });

      viewTransitionRef.current = transition;

      transition.finished.then(() => {
        setIsTransitioning(false);
        viewTransitionRef.current = null;
        // Clean up direction attribute after transition
        document.documentElement.removeAttribute("data-vt-direction");
      }).catch(() => {
        setIsTransitioning(false);
        viewTransitionRef.current = null;
        document.documentElement.removeAttribute("data-vt-direction");
      });
    }
  }, [pathname, shouldReduceMotion]);

  return (
    <span
      data-transitioning={isTransitioning || undefined}
      aria-busy={isTransitioning || undefined}
      style={{ display: "contents" }}
    >
      {children}
    </span>
  );
}