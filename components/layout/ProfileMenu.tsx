"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { CURRENT_STUDENT } from "@/lib/campus-data";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const logout = async () => {
    setLoggingOut(true);
    setLogoutError("");
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      setOpen(false);
      router.replace("/auth/login");
    } catch (error: unknown) {
      setLogoutError(
        error instanceof Error ? error.message : "Could not log out. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setLogoutError("");
          setOpen((value) => !value);
        }}
        className="flex min-h-11 items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-muted"
        aria-label={`Profile options for ${CURRENT_STUDENT.name}`}
        aria-controls="profile-actions"
        aria-expanded={open}
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
        <div
          id="profile-actions"
          className="glass-strong absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl py-1 shadow-xl"
        >
          <nav aria-label="Profile options">
            <Link href="/profile" className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              <UserRound className="size-4" /> Profile
            </Link>
            <Link href="/settings" className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              <Settings className="size-4" /> Settings
            </Link>
          </nav>
          {logoutError ? (
            <p role="alert" className="mx-2 my-1 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
              {logoutError}
            </p>
          ) : null}
          <button
            type="button"
            className="flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-60"
            onClick={logout}
            disabled={loggingOut}
          >
            <LogOut className="size-4" />
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
