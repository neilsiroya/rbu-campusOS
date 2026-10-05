"use client";

import { useEffect, useRef, useState } from "react";

export function useVisibilityPause(elementRef?: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(true);
  const isDocumentVisibleRef = useRef(true);
  const isElementInViewRef = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = !document.hidden;
      setIsVisible(isDocumentVisibleRef.current && isElementInViewRef.current);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    let observer: IntersectionObserver | null = null;
    if (elementRef && elementRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]) {
            isElementInViewRef.current = entries[0].isIntersecting;
            setIsVisible(isDocumentVisibleRef.current && isElementInViewRef.current);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(elementRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, [elementRef]);

  return isVisible;
}
