"use client";

import { useEffect, useState, type RefObject, useCallback } from "react";

export interface VisibilityPauseState {
  isPaused: boolean;
  isDocumentHidden: boolean;
  isOffscreen: boolean;
}

/**
 * Pause expensive 3D render loops when the page is hidden or
 * the containing element is offscreen. Returns a stable state.
 *
 * - isPaused = document.hidden OR element not intersecting.
 * - Respects IntersectionObserver threshold of 5%.
 * - Cleans up listeners + observer on unmount.
 */
export function useVisibilityPause(
  containerRef: RefObject<HTMLElement | null>
): VisibilityPauseState {
  const [state, setState] = useState<VisibilityPauseState>({
    isPaused: false,
    isDocumentHidden: false,
    isOffscreen: false,
  });

  const compute = useCallback(
    (docHidden: boolean, offscreen: boolean): VisibilityPauseState => ({
      isPaused: docHidden || offscreen,
      isDocumentHidden: docHidden,
      isOffscreen: offscreen,
    }),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    let docHidden = document.hidden;
    let offscreen = false;

    const apply = () => setState(compute(docHidden, offscreen));

    const handleVisibilityChange = () => {
      docHidden = document.hidden;
      apply();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const element = containerRef.current;
    let observer: IntersectionObserver | null = null;

    if (element && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          offscreen = !entry.isIntersecting;
          apply();
        },
        { threshold: 0.05, rootMargin: "50px" }
      );
      observer.observe(element);
    }

    apply();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (observer && element) {
        observer.unobserve(element);
        observer.disconnect();
      }
    };
  }, [containerRef, compute]);

  return state;
}
