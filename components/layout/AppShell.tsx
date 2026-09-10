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
  }, [setIsMobileMenuOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden text-foreground">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={() => setIsMobileMenuOpen((open) => !open)} />
        <main className="custom-scrollbar relative flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
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
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}
    </div>
  );
}
