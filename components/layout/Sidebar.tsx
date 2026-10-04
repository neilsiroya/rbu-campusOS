"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { NAV_GROUPS } from "@/lib/nav";
import { BrandMark } from "@/components/os/BrandMark";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

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
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>('[aria-controls="app-sidebar"]')?.focus();
      });
    }
  };

  return (
    <aside
      id="app-sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border/70 surface-elevated transition-transform duration-300 ease-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-5 py-5 border-b border-border/50">
        <BrandMark />
        <Button
          variant="ghost"
          size="icon"
          className="size-9 md:hidden"
          onClick={closeMobileMenu}
          aria-label="Close navigation"
        >
          <X className="size-4 text-foreground" />
        </Button>
      </div>

      <nav aria-label="Primary" className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 pb-8">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            <h2 className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
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
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary border-l-3 border-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.name}
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