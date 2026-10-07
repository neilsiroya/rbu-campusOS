"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Keep route changes predictable inside the independently scrolling app shell. */
export function ViewTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const main = document.getElementById("main-content");
    main?.scrollTo({ top: 0, behavior: "instant" });
    main?.focus({ preventScroll: true });
    // Keep the navigation frame fixed while the new workspace settles into place.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const plane = main?.firstElementChild;
      const animation = plane?.animate(
        [{ opacity: .65, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 220, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
      return () => animation?.cancel();
    }
  }, [pathname]);

  return children;
}
