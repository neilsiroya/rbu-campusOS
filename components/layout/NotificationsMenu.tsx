"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/lib/campus-data";

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(NOTIFICATIONS);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const unread = items.filter((notification) => notification.unread).length;

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

  const read = (id: string) => {
    setItems((all) =>
      all.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  return (
    <div ref={menuRef} className="relative">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className="relative size-9 rounded-xl"
        aria-label={`Notifications (${unread} unread)`}
        aria-controls="notifications-preview"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 ? (
          <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" aria-hidden="true" />
        ) : null}
      </Button>

      {open ? (
        <div
          id="notifications-preview"
          role="region"
          aria-label="Recent notifications"
          className="glass-strong absolute right-0 z-40 mt-2 w-[min(20rem,calc(100vw_-_1.5rem))] rounded-2xl p-2 shadow-xl"
        >
          <div className="flex items-center justify-between px-2 py-1">
            <p className="font-medium">Notifications</p>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close notifications"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
          {items.slice(0, 4).map((notification) => (
            <Link
              key={notification.id}
              href={notification.href}
              onClick={() => {
                read(notification.id);
                setOpen(false);
              }}
              className="block min-h-11 rounded-xl px-3 py-2 hover:bg-muted"
            >
              <div className="flex justify-between gap-2">
                <p className="text-sm font-medium">{notification.title}</p>
                {notification.unread ? (
                  <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                {notification.body} · {notification.time}
              </p>
            </Link>
          ))}
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="mt-1 block min-h-11 rounded-xl px-3 py-2 text-center text-sm hover:bg-muted"
          >
            View all notifications
          </Link>
        </div>
      ) : null}
    </div>
  );
}
