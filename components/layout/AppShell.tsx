"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ViewTransitionWrapper, SharedElement } from "./ViewTransitionWrapper";
import {
  LayoutDashboard,
  GraduationCap,
  Map,
  Sparkles,
  Menu,
} from "lucide-react";
import { motion, LayoutGroup, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

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

  const mobileNavItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Academics", href: "/academics", icon: GraduationCap },
    { label: "Map", href: "/map", icon: Map },
    { label: "AI", href: "/campus-ai", icon: Sparkles },
  ];

  return (
    <ViewTransitionWrapper className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex h-screen h-[100dvh] w-full overflow-hidden text-foreground">
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
            className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
            inert={isMobileMenuOpen ? true : undefined}
          >
            <Header
              onMenuToggle={() => setIsMobileMenuOpen((open) => !open)}
              isMobileMenuOpen={isMobileMenuOpen}
            />
            <main
              id="main-content"
              tabIndex={-1}
              className="app-main custom-scrollbar relative min-h-0 flex-1 overflow-y-auto p-3 pb-24 sm:p-4 sm:pb-24 md:p-6 md:pb-24 lg:pb-8 lg:p-8"
            >
              <SharedElement id="page-content">
                <div className="mx-auto w-full max-w-7xl">
                  {children}
                </div>
              </SharedElement>
            </main>

            {/* Mobile Thumb-Accessible Dock */}
            <nav
              aria-label="Mobile Bottom Navigation"
              className={cn(
                "fixed inset-x-0 bottom-0 z-20 flex items-stretch border-t border-border/70 bg-surface-elevated lg:hidden",
                "min-h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
              )}
            >
              <LayoutGroup id="mobile-dock-nav" inherit>
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                        isActive
                          ? "font-bold text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-dock-active"
                          className="absolute inset-1 rounded-md bg-primary/10 border-t-2 border-primary"
                          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                          aria-hidden="true"
                        />
                      )}
                      <Icon className="relative z-10 size-4" aria-hidden="true" />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  aria-label="Open full menu"
                  aria-controls="app-sidebar"
                  aria-expanded={isMobileMenuOpen}
                >
                  <Menu className="relative z-10 size-4" aria-hidden="true" />
                  <span className="relative z-10">More</span>
                </button>
              </LayoutGroup>
            </nav>
          </div>
        </SharedElement>

        {isMobileMenuOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-[39] bg-foreground/20 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : null}
      </div>
    </ViewTransitionWrapper>
  );
}
