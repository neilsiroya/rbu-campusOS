"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ViewTransitionWrapper, SharedElement } from "./ViewTransitionWrapper";
import { Menu } from "lucide-react";
import { MOBILE_NAV_ITEMS, navigationForPath } from "@/lib/nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentDestination = navigationForPath(pathname);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen || window.innerWidth >= 1024) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const items = Array.from(document.querySelectorAll<HTMLElement>('#app-sidebar a[href], #app-sidebar button:not([disabled])')).filter((item) => item.getClientRects().length > 0);
        const first = items[0];
        const last = items[items.length - 1];
        if (!document.querySelector("#app-sidebar")?.contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        return;
      }
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    document.querySelector<HTMLButtonElement>(
      '#app-sidebar button[aria-label="Close navigation"]'
    )?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.requestAnimationFrame(() => {
        if (previousFocus?.isConnected) previousFocus.focus();
      });
    };
  }, [isMobileMenuOpen]);

  return (
    <ViewTransitionWrapper className="flex min-h-0 flex-1 flex-col">
      <div className="app-shell relative flex h-screen h-[100dvh] w-full overflow-hidden text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:not-sr-only focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>

        <SharedElement id="sidebar-transition" className="relative z-40 h-full min-h-0 shrink-0">
          <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
        </SharedElement>

        <SharedElement id="app-header" className="relative flex min-w-0 flex-1">
          <div
            className="app-workspace relative flex min-w-0 flex-1 flex-col overflow-hidden"
            inert={isMobileMenuOpen ? true : undefined}
          >
            <Header
              onMenuToggle={() => setIsMobileMenuOpen((open) => !open)}
              isMobileMenuOpen={isMobileMenuOpen}
            />
            <main
              id="main-content"
              tabIndex={-1}
              className="app-main custom-scrollbar relative min-h-0 flex-1 overflow-y-auto"
            >
              <SharedElement id="page-content">
                <div className="app-page-content">
                  {children}
                </div>
              </SharedElement>
            </main>

            {/* Mobile Thumb-Accessible Dock */}
            <nav
              aria-label="Mobile Bottom Navigation"
              className="app-mobile-dock flex items-stretch lg:hidden"
            >
              {MOBILE_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={currentDestination?.href === item.href ? "page" : undefined}
                    className="campus-nav-item campus-dock-item type-label"
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="campus-nav-item campus-dock-item type-label"
                aria-label="Open full menu"
                aria-controls="app-sidebar"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu aria-hidden="true" />
                <span>More</span>
              </button>
            </nav>
          </div>
        </SharedElement>

        {isMobileMenuOpen ? (
          <button
            type="button"
            className="shell-drawer-backdrop fixed inset-0 lg:hidden"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : null}
      </div>
    </ViewTransitionWrapper>
  );
}
