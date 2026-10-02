"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const onBreakpointChange = () => {
      setIsDesktop(mediaQuery.matches);
      if (mediaQuery.matches) setIsMobileMenuOpen(false);
    };

    onBreakpointChange();
    mediaQuery.addEventListener("change", onBreakpointChange);
    return () => {
      mediaQuery.removeEventListener("change", onBreakpointChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen || isDesktop) return;

    const sidebar = document.getElementById("app-sidebar");
    const focusable = sidebar?.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isDesktop, isMobileMenuOpen]);

  const setSidebarOpen = (open: boolean) => {
    setIsMobileMenuOpen(open);
    if (!open && !isDesktop) menuButtonRef.current?.focus();
  };

  return (
    <div className="flex h-screen h-dvh w-full overflow-hidden text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Sidebar isOpen={isMobileMenuOpen} isDesktop={isDesktop} setIsOpen={setSidebarOpen} />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          menuButtonRef={menuButtonRef}
          onMenuToggle={() => setIsMobileMenuOpen((open) => !open)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="custom-scrollbar relative flex-1 overflow-y-auto scroll-mt-16 p-4 md:p-6 lg:p-8"
        >
          <div className="mx-auto w-full max-w-6xl surface rounded-2xl p-6">
            {children}
          </div>
        </main>
      </div>

      {isMobileMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-foreground/20 backdrop-blur-sm md:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
    </div>
  );
}
