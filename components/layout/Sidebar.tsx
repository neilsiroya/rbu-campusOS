"use client";

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
  isDesktop: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, isDesktop, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.replace("/auth/login", { scroll: false });
  };
  return (
    <aside
      id="app-sidebar"
      role={isOpen && !isDesktop ? "dialog" : undefined}
      aria-modal={isOpen && !isDesktop ? true : undefined}
      aria-label={isOpen && !isDesktop ? "CampusOS navigation" : undefined}
      inert={!isOpen && !isDesktop}
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border/70 glass-strong transition-transform duration-300 ease-out motion-reduce:transition-none md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-5 py-5">
        <BrandMark />
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation"
        >
          <X className="size-4 text-foreground" aria-hidden="true" />
        </Button>
      </div>

      <nav aria-label="Primary navigation" className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 pb-8">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            <h2 className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {group.group}
            </h2>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="size-4 shrink-0 text-current" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border/70 p-3">
        <Button
          variant="ghost"
          className="min-h-11 w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4 text-foreground" aria-hidden="true" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
