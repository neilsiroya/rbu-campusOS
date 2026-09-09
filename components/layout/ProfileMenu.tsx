"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { CURRENT_STUDENT } from "@/lib/campus-data";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-muted"
        aria-expanded={open}
        aria-haspopup="menu"
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
            aria-label="Close profile menu"
            onClick={() => setOpen(false)}
          />
          <div role="menu" className="glass-strong absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl py-1 shadow-xl">
            <Link href="/profile" role="menuitem" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              <UserRound className="size-4" /> Profile
            </Link>
            <Link href="/settings" role="menuitem" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              <Settings className="size-4" /> Settings
            </Link>
            <button type="button" role="menuitem" className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted" onClick={logout}>
              <LogOut className="size-4" /> Log out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
