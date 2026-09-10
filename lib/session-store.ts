"use client";

import { useCallback, useState } from "react";

/**
 * Session-only persistence hook.
 * Stores ephemeral student interactions (created listings, notes, confessions, etc.)
 * in browser sessionStorage without pretending to write to a backend server.
 */
function readStorage<T>(key: string): T[] | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : null;
  } catch {
    // Keep seed data if storage is unavailable
    return null;
  }
}

export function useSessionItems<T>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(() => readStorage(key) ?? seed);

  const prepend = useCallback(
    (item: T) => {
      setItems((current) => {
        const next = [item, ...current];
        try {
          sessionStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Ignore storage quota
        }
        return next;
      });
    },
    [key]
  );

  const update = useCallback(
    (updater: (current: T[]) => T[]) => {
      setItems((current) => {
        const next = updater(current);
        try {
          sessionStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Ignore storage quota
        }
        return next;
      });
    },
    [key]
  );

  return { items, prepend, update };
}