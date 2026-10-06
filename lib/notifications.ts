"use client";

import { NOTIFICATIONS } from "@/lib/campus-data";
import { useSessionItems } from "@/lib/session-store";

export function useNotifications() {
  const { items, update, storageError } = useSessionItems(
    "campusos.notifications",
    NOTIFICATIONS
  );
  const markRead = (id: string) => update((all) => all.map((item) =>
    item.id === id ? { ...item, unread: false } : item
  ));
  const markAllRead = () => update((all) => all.map((item) => ({ ...item, unread: false })));
  return { items, markRead, markAllRead, storageError };
}
