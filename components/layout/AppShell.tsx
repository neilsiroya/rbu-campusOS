"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen || window.innerWidth >= 768) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMobileMenuOpen(false);
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>('[aria-controls="app-sidebar"]')?.focus();
      });
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    document.querySelector<HTMLButtonElement>(
      '#app-sidebar button[aria-label="Close navigation"]'
    )?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="relative flex h-screen h-[100dvh] w-full overflow-hidden text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:not-sr-only focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

<<<<<<< HEAD
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={() => setIsMobileMenuOpen((open) => !open)} />
        <main className="custom-scrollbar relative flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl surface rounded-2xl p-6 md:p-8">
=======
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
          className="custom-scrollbar relative min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8"
        >
          <div className="surface mx-auto w-full max-w-6xl rounded-2xl p-4 sm:p-6">
>>>>>>> origin/main
            {children}
          </div>
        </main>
      </div>

      {isMobileMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-foreground/20 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}
    </div>
  );
}
