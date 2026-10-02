"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/lib/campus-data";
export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(NOTIFICATIONS);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const unread = items.filter((notification) => notification.unread).length;
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };
  const read = (id: string) =>
    setItems((all) =>
      all.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className="relative size-11 rounded-xl"
        aria-label={`Notifications (${unread} unread)`}
        aria-expanded={open}
        aria-controls={open ? "notifications-panel" : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 && (
          <span
            className="absolute right-1 top-1 size-2 rounded-full bg-destructive"
            aria-hidden="true"
          />
        )}
      </Button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          />
          <div
            id="notifications-panel"
            role="region"
            aria-label="Recent notifications"
            className="glass-strong absolute right-0 z-40 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl p-2 shadow-xl"
          >
            <div className="flex items-center justify-between px-2 py-1">
              <p className="font-medium">Notifications</p>
              <Button
                variant="ghost"
                size="icon"
                className="size-11"
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
                  {notification.unread && (
                    <>
                      <span className="sr-only">Unread</span>
                      <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {notification.body} · {notification.time}
                </p>
              </Link>
            ))}
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="mt-1 block min-h-11 rounded-xl px-3 py-3 text-center text-sm hover:bg-muted"
            >
              View all notifications
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
