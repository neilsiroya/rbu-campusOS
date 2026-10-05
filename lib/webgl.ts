"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

type Disposable =
  | THREE.BufferGeometry
  | THREE.Material
  | THREE.Texture
  | THREE.WebGLRenderTarget
  | THREE.RenderTarget;

type CleanupFn = () => void;

export interface SceneCleanupHandle {
  track: (resource: Disposable | Disposable[]) => void;
  addCleanup: (fn: CleanupFn) => void;
  disposeAll: () => void;
}

function isDisposable(value: unknown): value is Disposable {
  if (value == null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.dispose === "function" &&
    !(value instanceof THREE.Scene) &&
    !(value instanceof THREE.Object3D)
  );
}

function deepDisposeObject(obj: THREE.Object3D, seen: WeakSet<object>): void {
  if (seen.has(obj)) return;
  seen.add(obj);

  const mesh = obj as THREE.Mesh;
  if (mesh.geometry && isDisposable(mesh.geometry)) {
    try { mesh.geometry.dispose(); } catch { /* noop */ }
  }
  if (mesh.material) {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of materials) {
      if (isDisposable(mat)) {
        try {
          const m = mat as THREE.Material & Record<string, unknown>;
          for (const key of Object.keys(m)) {
            const val = m[key];
            if (val instanceof THREE.Texture || isDisposable(val)) {
              try { (val as Disposable).dispose(); } catch { /* noop */ }
            }
          }
          mat.dispose();
        } catch { /* noop */ }
      }
    }
  }

  obj.traverse?.((child) => {
    if (child !== obj) deepDisposeObject(child, seen);
  });
}

/**
 * Hook-based GPU resource collector + disposal trigger.
 *
 * Usage:
 *   const cleanup = useSceneCleanup();
 *   const geom = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
 *   cleanup.track(geom);
 *
 * On unmount, disposes everything. Also exposed as `disposeAll()` for manual
 * triggers (e.g. React Strict Mode double-remount safety).
 */
export function useSceneCleanup(): SceneCleanupHandle {
  const resourcesRef = useRef<Set<Disposable>>(new Set());
  const cleanupFnsRef = useRef<Set<CleanupFn>>(new Set());
  const disposedRef = useRef(false);

  const track = useCallback((resource: Disposable | Disposable[]) => {
    const list = Array.isArray(resource) ? resource : [resource];
    for (const r of list) {
      if (isDisposable(r) && !resourcesRef.current.has(r)) {
        resourcesRef.current.add(r);
      }
    }
  }, []);

  const addCleanup = useCallback((fn: CleanupFn) => {
    cleanupFnsRef.current.add(fn);
  }, []);

  const disposeAll = useCallback(() => {
    if (disposedRef.current) return;
    disposedRef.current = true;

    for (const fn of cleanupFnsRef.current) {
      try { fn(); } catch { /* noop */ }
    }
    cleanupFnsRef.current.clear();

    for (const r of resourcesRef.current) {
      try {
        if (r instanceof THREE.WebGLRenderTarget) {
          r.dispose();
        } else if (isDisposable(r)) {
          r.dispose();
        }
      } catch { /* noop */ }
    }
    resourcesRef.current.clear();
  }, []);

  useEffect(() => {
    disposedRef.current = false;
    return () => {
      disposeAll();
    };
  }, [disposeAll]);

  return { track, addCleanup, disposeAll };
}

export function disposeObject3D(root: THREE.Object3D | null): void {
  if (!root) return;
  deepDisposeObject(root, new WeakSet());
}
