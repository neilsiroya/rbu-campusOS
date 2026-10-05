"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { NAV_GROUPS } from "@/lib/nav";
import { BrandMark } from "@/components/os/BrandMark";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace("/auth/login", { scroll: false });
    } catch (error: unknown) {
      setLogoutError(
        error instanceof Error ? error.message : "Could not log out. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>('[aria-controls="app-sidebar"]')?.focus();
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeMobileMenu();
    }
  };

  return (
    <aside
      id="app-sidebar"
      onKeyDown={handleKeyDown}
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border/70 surface-elevated transition-transform duration-300 ease-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between px-5 py-5 border-b border-border/50">
        <BrandMark />
        <Button
          variant="ghost"
          size="icon"
          className="size-11 lg:hidden"
          onClick={closeMobileMenu}
          aria-label="Close navigation"
        >
          <X className="size-4 text-foreground" />
        </Button>
      </div>

      <nav
        aria-label="Primary navigation"
        className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 pb-8"
        onKeyDown={handleKeyDown}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            <h2 className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <ChevronRight className="size-3.5 opacity-50" aria-hidden="true" />
              {group.group}
            </h2>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      closeMobileMenu();
                    }
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-xl bg-primary/10 border-l-2 border-primary"
                      transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon className="relative z-10 size-4 shrink-0" aria-hidden="true" />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      className="relative z-10 ml-auto size-1.5 rounded-full bg-primary"
                      initial={shouldReduceMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border/70 p-4">
        {logoutError ? (
          <p role="alert" className="mb-2 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
            {logoutError}
          </p>
        ) : null}
        <Button
          variant="ghost"
          className="min-h-11 w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="size-4 text-foreground" />
          {loggingOut ? "Logging out…" : "Log out"}
        </Button>
      </div>
    </aside>
  );
}