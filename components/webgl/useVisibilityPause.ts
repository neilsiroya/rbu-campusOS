"use client";

import { useEffect, useState, type RefObject } from "react";

export function useVisibilityPause(containerRef: RefObject<HTMLElement | null>): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isDocumentVisible = !document.hidden;
    let isIntersecting = true;

    const updateVisibility = () => {
      setIsVisible(isDocumentVisible && isIntersecting);
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      updateVisibility();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const element = containerRef.current;
    let observer: IntersectionObserver | null = null;

    if (element && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = entry.isIntersecting;
          updateVisibility();
        },
        { threshold: 0.05 }
      );
      observer.observe(element);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (observer && element) {
        observer.unobserve(element);
        observer.disconnect();
      }
    };
  }, [containerRef]);

  return isVisible;
}
