"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { titleForPath } from "@/lib/nav";
import { BrandMark } from "@/components/os/BrandMark";
import CommandSearch from "./CommandSearch";
import NotificationsMenu from "./NotificationsMenu";
import ProfileMenu from "./ProfileMenu";

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const dark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border/70 px-3 glass-surface md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 hover:bg-muted/50 md:hidden"
          onClick={onMenuToggle}
          aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-controls="app-sidebar"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="size-5 text-foreground" aria-hidden="true" />
          ) : (
            <Menu className="size-5 text-foreground" aria-hidden="true" />
          )}
        </Button>
        <div className="md:hidden">
          <BrandMark compact />
          </div>
          <p className="hidden truncate text-sm text-muted-foreground md:block">{titleForPath(pathname)}</p>
      </div>

      <div className="flex items-center gap-1">
          <CommandSearch />
          <Button
            variant="ghost"
            size="icon"
          className="size-9 rounded-full hover:bg-muted/50"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setTheme(dark ? "light" : "dark")}
        >
          {mounted ? (dark ? <Sun className="size-4 text-foreground" /> : <Moon className="size-4 text-foreground" />) : <span className="size-4" />}
        </Button>
        <div className="hidden sm:block">
          <NotificationsMenu />
        </div>
        <ProfileMenu />
      </div>
    </header>
  );
}
