"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Session-only persistence hook.
 * Stores ephemeral student interactions (created listings, notes, confessions, etc.)
 * in browser sessionStorage without pretending to write to a backend server.
 */
export function useSessionItems<T>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    try {
      const raw = sessionStorage.getItem(key);
      if (raw && isMounted) {
        setItems(JSON.parse(raw) as T[]);
      }
    } catch {
      // Keep seed data if storage is unavailable
    }
    if (isMounted) {
      setHydrated(true);
    }
    return () => {
      isMounted = false;
    };
  }, [key]);

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

  return { items, prepend, update, hydrated };
}
