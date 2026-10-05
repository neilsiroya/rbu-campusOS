"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ViewTransitionWrapper, SharedElement } from "./ViewTransitionWrapper";
import { ImmersiveModeOverlay } from "@/components/immersive/ImmersiveModeOverlay";
import {
  LayoutDashboard,
  GraduationCap,
  Map,
  Sparkles,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  const mobileNavItems = [
    { label: "Command", href: "/dashboard", icon: LayoutDashboard },
    { label: "Academics", href: "/academics", icon: GraduationCap },
    { label: "3D Map", href: "/map", icon: Map },
    { label: "AI", href: "/campus-ai", icon: Sparkles },
  ];

  return (
    <ViewTransitionWrapper>
      <div className="relative flex h-screen h-[100dvh] w-full overflow-hidden text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:not-sr-only focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* Global Immersive Spatial Mode Overlay */}
        <ImmersiveModeOverlay />

        <SharedElement id="app-sidebar">
          <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
        </SharedElement>

        <SharedElement id="app-header">
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
              className="custom-scrollbar relative min-h-0 flex-1 overflow-y-auto p-3 pb-20 sm:p-4 md:pb-8 md:p-6 lg:p-8"
            >
              <SharedElement id="page-content">
                <div className="surface mx-auto w-full max-w-7xl rounded-2xl p-4 sm:p-6 md:p-8">
                  {children}
                </div>
              </SharedElement>
            </main>

            {/* Mobile Thumb-Accessible Dock */}
            <nav
              aria-label="Mobile Bottom Navigation"
              className="fixed bottom-0 left-0 right-0 z-20 flex h-14 items-center justify-around border-t border-border/70 bg-background/90 px-2 backdrop-blur-lg md:hidden"
            >
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
                      isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                aria-label="Open full menu"
              >
                <Menu className="size-4" />
                <span>More</span>
              </button>
            </nav>
          </div>
        </SharedElement>

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
    </ViewTransitionWrapper>
  );
}
