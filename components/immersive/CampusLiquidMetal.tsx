"use client";

import * as THREE from "three";
import React, { useRef, useMemo, useEffect, useCallback, useState, type ReactNode, type KeyboardEvent } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useAdaptiveQuality } from "@/components/webgl/useAdaptiveQuality";
import { useSceneCleanup, disposeObject3D } from "@/lib/webgl";
import { ImmersiveCanvas } from "@/components/webgl/ImmersiveCanvas";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type LiquidInteraction = "idle" | "hover" | "press" | "focus";

const BASE_PRIMARY_DARK = 0x34d399;
const BASE_PRIMARY_LIGHT = 0x10b981;
const METAL_DARK = 0x0d1712;
const METAL_LIGHT = 0xe6f4ee;

function ease(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

interface CampusLiquidMetalCoreProps {
  radius?: number;
  detail?: number;
  intensity?: number;
  speed?: number;
  interactive?: boolean;
  focused?: boolean;
  /** Increment to fire a press ripple from keyboard/assistive interaction. */
  pulseSignal?: number;
  onInteractionChange?: (state: LiquidInteraction) => void;
}

export function CampusLiquidMetalCore({
  radius = 1.2,
  detail = 5,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
  focused = false,
  pulseSignal = 0,
  onInteractionChange,
}: CampusLiquidMetalCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { reducedMotion, tier, isMobile } = useAdaptiveQuality();
  const { resolvedTheme } = useTheme();
  const cleanup = useSceneCleanup();

  const isDark = resolvedTheme !== "light";
  const actualDetail = tier === "low" || isMobile ? 4 : detail;
  const effectiveSpeed = reducedMotion ? 0.2 : speed;

  const baseColor = isDark ? METAL_DARK : METAL_LIGHT;
  const primaryColor = isDark ? BASE_PRIMARY_DARK : BASE_PRIMARY_LIGHT;

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(radius, actualDetail);
    geo.computeVertexNormals();
    return geo;
  }, [radius, actualDetail]);

  useEffect(() => {
    cleanup.track(geometry);
    cleanup.addCleanup(() => {
      const group = groupRef.current;
      if (group) disposeObject3D(group);
    });
  }, [geometry, cleanup]);

  const originalPositions = useRef<Float32Array | null>(null);
  const baseNormals = useRef<Float32Array | null>(null);

  useEffect(() => {
    originalPositions.current = geometry.attributes.position.array.slice() as Float32Array;
    baseNormals.current = geometry.attributes.normal.array.slice() as Float32Array;
  }, [geometry]);

  const easedPointer = useRef({ x: 0, y: 0, active: false });
  const targetPointer = useRef({ x: 0, y: 0, active: false });
  const pressPulse = useRef({ t: -1, origin: new THREE.Vector3() });
  const focusPulse = useRef(0);
  const focusLatch = useRef(false);

  useEffect(() => {
    if (focused && !focusLatch.current) {
      focusPulse.current = 1;
      focusLatch.current = true;
    } else if (!focused) {
      focusLatch.current = false;
    }
  }, [focused]);

  // Keyboard/assistive press: ripple from the surface crown.
  useEffect(() => {
    if (pulseSignal > 0 && interactive && !reducedMotion) {
      pressPulse.current = { t: 0, origin: new THREE.Vector3(0, 0, radius) };
      onInteractionChange?.("press");
    }
  }, [pulseSignal, interactive, reducedMotion, radius, onInteractionChange]);

  const surfaceToLocal = useCallback((event: ThreeEvent<PointerEvent>) => {
    const point = event.point.clone();
    if (meshRef.current) meshRef.current.worldToLocal(point);
    return point;
  }, []);

  const setPointerFromEvent = useCallback((event: ThreeEvent<PointerEvent>, active: boolean) => {
    const x = (event.uv?.x ?? 0.5) * 2 - 1;
    const y = (event.uv?.y ?? 0.5) * 2 - 1;
    targetPointer.current.x = x;
    targetPointer.current.y = y;
    targetPointer.current.active = active;
  }, []);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!interactive || reducedMotion) return;
      setPointerFromEvent(e, true);
      onInteractionChange?.(focused ? "focus" : "hover");
    },
    [setPointerFromEvent, interactive, reducedMotion, focused, onInteractionChange]
  );

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!interactive || reducedMotion) return;
      setPointerFromEvent(e, true);
    },
    [setPointerFromEvent, interactive, reducedMotion]
  );

  const handlePointerOut = useCallback(() => {
    targetPointer.current.active = false;
    onInteractionChange?.(focused ? "focus" : "idle");
  }, [focused, onInteractionChange]);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!interactive || reducedMotion) return;
      pressPulse.current = { t: 0, origin: surfaceToLocal(e) };
      onInteractionChange?.("press");
    },
    [surfaceToLocal, interactive, reducedMotion, onInteractionChange]
  );

  const handlePointerUp = useCallback(() => {
    onInteractionChange?.(targetPointer.current.active ? (focused ? "focus" : "hover") : focused ? "focus" : "idle");
  }, [focused, onInteractionChange]);

  useFrame((state, deltaRaw) => {
    if (!meshRef.current || !originalPositions.current || !baseNormals.current) return;
    const delta = Math.min(deltaRaw, 1 / 30);

    easedPointer.current.x = ease(
      easedPointer.current.x,
      targetPointer.current.active ? targetPointer.current.x : 0,
      6,
      delta
    );
    easedPointer.current.y = ease(
      easedPointer.current.y,
      targetPointer.current.active ? targetPointer.current.y : 0,
      6,
      delta
    );
    easedPointer.current.active = targetPointer.current.active;

    if (pressPulse.current.t >= 0) {
      pressPulse.current.t += delta;
      if (pressPulse.current.t > 0.9) pressPulse.current.t = -1;
    }
    focusPulse.current = Math.max(0, focusPulse.current - delta * 1.4);
    if (focused) focusPulse.current = Math.max(focusPulse.current, 0.15);

    const pos = meshRef.current.geometry.attributes.position;
    const orig = originalPositions.current;
    const norms = baseNormals.current;
    const count = pos.count;
    const time = state.clock.getElapsedTime() * effectiveSpeed;

    const pointerVector = { x: easedPointer.current.x, y: easedPointer.current.y };
    const pointerActive = interactive && easedPointer.current.active && !reducedMotion;
    const pointerInfluence = pointerActive ? 0.045 * intensity : 0;

    const flowT = time * 0.55;
    const noiseAmount = (0.12 * intensity) * (isMobile ? 0.7 : 1);

    const press = pressPulse.current;
    const pressActive = press.t >= 0;
    const pressRadius = pressActive ? Math.pow(Math.min(press.t / 0.5, 1), 0.5) * 1.6 : 0;
    const pressDepth = pressActive ? Math.sin(press.t / 0.5 * Math.PI) * 0.16 * intensity : 0;

    for (let i = 0; i < count; i++) {
      const u = i * 3;
      const ox = orig[u];
      const oy = orig[u + 1];
      const oz = orig[u + 2];
      const nx = norms[u];
      const ny = norms[u + 1];
      const nz = norms[u + 2];

      const len = Math.hypot(ox, oy, oz) || 1;
      const sx = ox / len;
      const sy = oy / len;
      const sz = oz / len;

      const f1 =
        Math.sin(sx * 2.3 + flowT) *
        Math.cos(sy * 2.2 + flowT * 0.7) *
        Math.sin(sz * 2.4 + flowT * 1.1);
      const f2 = Math.sin(sx * 4.1 + flowT * 1.6) * Math.cos(sy * 3.9 - flowT * 0.5) * 0.5;
      const flowNoise = (f1 + f2 * 0.35) * noiseAmount;

      let pointerNudge = 0;
      if (pointerActive) {
        const theta = Math.atan2(sy, sx);
        const phi = Math.acos(sz);
        const surfaceU = (theta + Math.PI) / (2 * Math.PI);
        const surfaceV = phi / Math.PI;
        const localX = surfaceU * 2 - 1;
        const localY = 1 - surfaceV * 2;
        const dx = localX - pointerVector.x;
        const dy = localY - pointerVector.y;
        const dist = Math.hypot(dx, dy);
        const falloff = Math.max(0, 1 - dist / 0.6);
        pointerNudge = falloff * falloff * pointerInfluence;
      }

      let pressNudge = 0;
      if (pressActive) {
        const dp = Math.hypot(ox - press.origin.x, oy - press.origin.y, oz - press.origin.z);
        const ring = Math.abs(dp - pressRadius);
        const envelope = Math.max(0, 1 - ring / 0.35);
        pressNudge = -envelope * pressDepth;
      }

      const focusNudge = focusPulse.current * 0.02 * Math.sin((sx + 1) * 8 + time * 4);
      const total = flowNoise + pointerNudge + pressNudge + focusNudge;

      pos.setXYZ(i, ox + nx * total, oy + ny * total, oz + nz * total);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    if (groupRef.current) {
      const rotAmt = pointerActive ? 0.35 : 0.18;
      groupRef.current.rotation.y = ease(
        groupRef.current.rotation.y,
        easedPointer.current.x * rotAmt + state.clock.getElapsedTime() * 0.06 * effectiveSpeed,
        4,
        delta
      );
      groupRef.current.rotation.x = ease(
        groupRef.current.rotation.x,
        -easedPointer.current.y * rotAmt * 0.6 + Math.sin(state.clock.getElapsedTime() * 0.12) * 0.12,
        4,
        delta
      );
    }

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      const baseEmissive = isDark ? 0.32 : 0.12;
      const hoverBoost = pointerActive ? 0.16 : 0;
      const pressBoost = pressActive ? 0.12 : 0;
      const focusBoost = focusPulse.current * 0.18;
      mat.emissiveIntensity = baseEmissive + hoverBoost + pressBoost + focusBoost;
      mat.roughness = ease(mat.roughness, isDark ? 0.2 : 0.26, 3, delta);
    }
  });

  const emissiveHex = isDark ? 0x064e3b : 0x10b981;

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerOut}
      >
        <meshStandardMaterial
          color={baseColor}
          metalness={isDark ? 0.94 : 0.86}
          roughness={isDark ? 0.2 : 0.26}
          emissive={emissiveHex}
          emissiveIntensity={isDark ? 0.32 : 0.12}
          envMapIntensity={isDark ? 1.1 : 0.9}
          flatShading={false}
        />
      </mesh>
      {focused && (
        <mesh>
          <icosahedronGeometry args={[radius * 1.06, 2]} />
          <meshBasicMaterial color={primaryColor} transparent opacity={0.4} wireframe />
        </mesh>
      )}
    </group>
  );
}

interface CampusLiquidMetalProps extends CampusLiquidMetalCoreProps {
  className?: string;
  style?: React.CSSProperties;
  fallback?: ReactNode;
  sceneName?: string;
  cameraFov?: number;
  /** Accessible name for the surface when interactive. */
  label?: string;
  /** Fired on press (pointer or keyboard). */
  onPress?: () => void;
}

export function CampusLiquidMetal({
  className,
  style,
  radius,
  detail,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
  focused,
  pulseSignal,
  onInteractionChange,
  fallback,
  sceneName = "CampusOS Liquid Surface",
  cameraFov = 50,
  label = "CampusOS liquid metal surface. Press Enter to pulse.",
  onPress,
}: CampusLiquidMetalProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [pulse, setPulse] = useState(0);
  const showFocused = focused ?? isFocused;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setPulse((p) => p + 1);
      onPress?.();
    }
  };

  return (
    <div
      className={cn(
        "relative",
        interactive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      style={style}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? label : undefined}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
    >
      <ImmersiveCanvas
        sceneName={sceneName}
        camera={{ position: [0, 0, 4], fov: cameraFov, near: 0.1, far: 100 }}
        fallback={
          fallback ?? (
            <div className="flex h-full w-full items-center justify-center p-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-9 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{sceneName}</p>
                  <p className="text-[10px] text-muted-foreground">2D accelerated fallback active.</p>
                </div>
              </div>
            </div>
          )
        }
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <pointLight position={[-3, -2, -4]} intensity={0.9} color={BASE_PRIMARY_DARK} />
        <CampusLiquidMetalCore
          radius={radius}
          detail={detail}
          intensity={intensity}
          speed={speed}
          interactive={interactive}
          focused={showFocused}
          pulseSignal={pulseSignal ?? pulse}
          onInteractionChange={onInteractionChange}
        />
      </ImmersiveCanvas>
    </div>
  );
}

export default CampusLiquidMetal;
