"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { NAV_GROUPS, navigationForPath } from "@/lib/nav";
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
  const currentDestination = navigationForPath(pathname);

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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeMobileMenu();
    }
  };

  return (
    <aside
      id="app-sidebar"
      data-surface="contained"
      onKeyDown={handleKeyDown}
      className={cn(
        "app-sidebar fixed inset-y-0 left-0 z-40 flex h-[100dvh] min-h-0 w-64 max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-r border-border/70 surface-elevated transition-transform duration-300 ease-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0 visible" : "-translate-x-full invisible lg:visible"
      )}
      aria-label="Main navigation"
    >
      <div data-controls className="shell-identity flex shrink-0 items-center justify-between">
        <BrandMark onClick={closeMobileMenu} />
        <Button
          variant="ghost"
          size="icon"
          className="shell-mobile-control size-11 lg:hidden"
          onClick={closeMobileMenu}
          aria-label="Close navigation"
        >
          <X className="size-4 text-foreground" />
        </Button>
      </div>

      <nav
        aria-label="Primary navigation"
        className="shell-navigation custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="navigation-group" role="group" aria-label={group.group}>
            {group.group !== "Home" && (
              <h2 className="type-label navigation-group-label">{group.group}</h2>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={currentDestination?.href === item.href ? "page" : undefined}
                  className="campus-nav-item type-navigation"
                >
                  <Icon aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div data-controls className="shell-account shrink-0">
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
