"use client";

import { useCallback, useSyncExternalStore } from "react";

type SessionSnapshot<T> = {
  items: T[];
  storageError: string | null;
};

type SessionStore = {
  value: string;
  loaded: boolean;
  listeners: Set<() => void>;
};

const stores = new Map<string, SessionStore>();

function serializeSnapshot<T>(items: T[], storageError: string | null) {
  return JSON.stringify({ items, storageError });
}

function getStore(key: string, initialValue: string) {
  const existing = stores.get(key);
  if (existing) return existing;

  const store: SessionStore = {
    value: initialValue,
    loaded: false,
    listeners: new Set(),
  };
  stores.set(key, store);
  return store;
}

function readClientSnapshot<T>(store: SessionStore, key: string, seed: T[]) {
  if (typeof window === "undefined" || store.loaded) return store.value;

  store.loaded = true;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        throw new Error("Saved session data is not a list.");
      }
      store.value = serializeSnapshot(parsed, null);
    }
  } catch {
    store.value = serializeSnapshot(
      seed,
      "Saved session data could not be restored. New changes may not survive a reload."
    );
  }
  return store.value;
}

function subscribe(store: SessionStore, listener: () => void) {
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

function saveItems<T>(
  store: SessionStore,
  key: string,
  items: T[]
) {
  let storageError: string | null = null;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(items));
  } catch {
    storageError =
      "Browser storage is unavailable. New changes will stay in memory and may be lost on reload.";
  }

  store.value = serializeSnapshot(items, storageError);
  store.listeners.forEach((listener) => listener());
}

export function useSessionItems<T>(key: string, seed: T[]) {
  const initialValue = serializeSnapshot(seed, null);
  const store = getStore(key, initialValue);
  const subscribeToStore = useCallback(
    (listener: () => void) => subscribe(store, listener),
    [store]
  );
  const getSnapshot = useCallback(
    () => readClientSnapshot(store, key, seed),
    [store, key, seed]
  );
  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);
  const value = useSyncExternalStore(
    subscribeToStore,
    getSnapshot,
    getServerSnapshot
  );
  const snapshot = JSON.parse(value) as SessionSnapshot<T>;

  const prepend = useCallback(
    (item: T) => {
      const current = JSON.parse(store.value) as SessionSnapshot<T>;
      saveItems(store, key, [item, ...current.items]);
    },
    [key, store]
  );

  const update = useCallback(
    (updater: (current: T[]) => T[]) => {
      const current = JSON.parse(store.value) as SessionSnapshot<T>;
      saveItems(store, key, updater(current.items));
    },
    [key, store]
  );

  return {
    items: snapshot.items,
    prepend,
    update,
    storageError: snapshot.storageError,
  };
}
