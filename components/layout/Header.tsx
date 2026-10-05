"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X, Sparkles, Layers, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { titleForPath } from "@/lib/nav";
import { BrandMark } from "@/components/os/BrandMark";
import CommandSearch from "./CommandSearch";
import NotificationsMenu from "./NotificationsMenu";
import ProfileMenu from "./ProfileMenu";
import { useReducedMotion, motion } from "framer-motion";
import { useOSStore } from "@/lib/os-store";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { mode, setMode } = useOSStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const dark = mounted && resolvedTheme === "dark";

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border/70 px-3 glass-surface md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 hover:bg-muted/50 lg:hidden"
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
        <div className="lg:hidden">
          <BrandMark compact />
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <p className="truncate text-sm font-semibold text-foreground">{titleForPath(pathname)}</p>
          <span className="text-muted-foreground/40 font-mono text-xs">/</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            NODE-01 ACTIVE
          </span>
        </div>

        <div className="hidden lg:block">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, width: 0, x: 20 }}
            animate={{ opacity: 1, width: "100%", x: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, width: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <CommandSearch onOpen={handleSearchOpen} onClose={handleSearchClose} />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* OS Mode Switcher (Normal | Focus | Immersive) */}
        <div className="hidden lg:flex items-center rounded-xl bg-muted/40 p-0.5 border border-border/40 text-xs" role="group" aria-label="CampusOS display mode">
          <button
            type="button"
            aria-pressed={mode === "normal"}
            onClick={() => setMode("normal")}
            className={cn(
              "min-h-8 px-2.5 py-1 rounded-lg font-medium transition-colors",
              mode === "normal"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Standard
          </button>
          <button
            type="button"
            aria-pressed={mode === "focus"}
            onClick={() => setMode("focus")}
            className={cn(
              "min-h-8 px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1",
              mode === "focus"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Focus Mode: Minimalist academic runway"
          >
            <Eye className="size-3 text-primary" />
            Focus
          </button>
          <button
            type="button"
            aria-pressed={mode === "immersive"}
            onClick={() => setMode("immersive")}
            className={cn(
              "min-h-8 px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1",
              mode === "immersive"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Immersive Mode: 3D Spatial Theater"
          >
            <Sparkles className="size-3" />
            Spatial 3D
          </button>
        </div>

        {searchOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-10 lg:hidden bg-background/80 backdrop-blur-sm"
            onClick={handleSearchClose}
            aria-hidden="true"
          />
        )}

        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full hover:bg-muted/50"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setTheme(dark ? "light" : "dark")}
        >
          {mounted ? (
            dark ? <Sun className="size-4 text-foreground" /> : <Moon className="size-4 text-foreground" />
          ) : (
            <span className="size-4" />
          )}
        </Button>
        <div className="hidden sm:block">
          <NotificationsMenu />
        </div>
        <ProfileMenu />
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <CommandSearch onOpen={handleSearchOpen} onClose={handleSearchClose} />
        </div>
      )}
    </header>
  );
}
