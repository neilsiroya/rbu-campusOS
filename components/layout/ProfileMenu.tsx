"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { CURRENT_STUDENT } from "@/lib/campus-data";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 min-w-11 items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-muted"
        aria-label={`Account menu for ${CURRENT_STUDENT.name}`}
        aria-expanded={open}
        aria-controls={open ? "profile-menu" : undefined}
      >
        <span className="grid size-8 place-items-center rounded-lg bg-foreground font-display text-sm text-background">
          {CURRENT_STUDENT.name.charAt(0)}
        </span>
        <span className="hidden text-left lg:block">
          <span className="block text-xs font-medium leading-none">{CURRENT_STUDENT.name}</span>
          <span className="mt-0.5 block text-[10px] text-muted-foreground">{CURRENT_STUDENT.id}</span>
        </span>
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          />
          <div id="profile-menu" className="glass-strong absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl py-1 shadow-xl">
            <Link href="/profile" className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              <UserRound className="size-4" aria-hidden="true" /> Profile
            </Link>
            <Link href="/settings" className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              <Settings className="size-4" aria-hidden="true" /> Settings
            </Link>
            <button type="button" className="flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted" onClick={logout}>
              <LogOut className="size-4" aria-hidden="true" /> Log out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
