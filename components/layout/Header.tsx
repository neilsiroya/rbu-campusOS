"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { titleForPath, NAV_GROUPS } from "@/lib/nav";
import { BrandMark } from "@/components/os/BrandMark";
import CommandSearch from "./CommandSearch";
import NotificationsMenu from "./NotificationsMenu";
import ProfileMenu from "./ProfileMenu";

const subscribe = () => () => {};
export default function Header({ onMenuToggle, isMobileMenuOpen }: {
  onMenuToggle: () => void; isMobileMenuOpen: boolean;
}) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  const group = NAV_GROUPS.find((g) => g.items.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)))?.group;
  return (
    <header className="app-header flex h-[72px] shrink-0 items-center justify-between gap-2 border-b border-border px-3 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <Button variant="ghost" size="icon" className="size-11 lg:hidden" onClick={onMenuToggle}
          aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-controls="app-sidebar" aria-expanded={isMobileMenuOpen}>
          {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
        <div className="app-header-brand sm:hidden"><BrandMark compact /></div>
        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 text-sm sm:flex">
          <span className="text-muted-foreground">{group ?? "CampusOS"}</span>
          <ChevronRight className="size-3 text-muted-foreground" aria-hidden="true" />
          <span className="truncate font-medium" aria-current="page">{titleForPath(pathname)}</span>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <CommandSearch />
        <Button variant="ghost" size="icon" className="size-11"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setTheme(dark ? "light" : "dark")}>
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <div className="hidden sm:block"><NotificationsMenu /></div>
        <ProfileMenu />
      </div>
    </header>
  );
}
