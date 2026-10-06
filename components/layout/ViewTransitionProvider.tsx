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
  }, [pathname]);

  return children;
}
