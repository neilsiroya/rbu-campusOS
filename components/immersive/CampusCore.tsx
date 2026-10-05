"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { ImmersiveCanvas } from "@/components/webgl/ImmersiveCanvas";
import { useAdaptiveQuality } from "@/components/webgl/useAdaptiveQuality";
import { useSceneCleanup, disposeObject3D } from "@/lib/webgl";
import { useOSStore } from "@/lib/os-store";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  Activity,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CampusLiquidMetalCore } from "@/components/immersive/CampusLiquidMetal";

function ease(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function OrbitalRing({
  radius = 2.1,
  rotation = [0, 0, 0],
  speed = 0.4,
  intensity = 1.0,
  isDark = true,
  nodeCount = 4,
}: {
  radius?: number;
  rotation?: [number, number, number];
  speed?: number;
  intensity?: number;
  isDark?: boolean;
  nodeCount?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const torusGeom = useMemo(() => new THREE.TorusGeometry(radius, 0.016, 16, 100), [radius]);
  const cleanup = useSceneCleanup();

  useEffect(() => {
    cleanup.track(torusGeom);
    cleanup.addCleanup(() => {
      if (groupRef.current) disposeObject3D(groupRef.current);
    });
  }, [torusGeom, cleanup]);

  const effectiveSpeed = useMemo(() => speed * Math.max(0.4, intensity), [speed, intensity]);

  const nodeGeom = useMemo(() => new THREE.SphereGeometry(0.075, 16, 16), []);
  useEffect(() => {
    cleanup.track(nodeGeom);
  }, [nodeGeom, cleanup]);

  const nodes = useMemo(() => {
    const list: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      list.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    }
    return list;
  }, [radius, nodeCount]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = clock.getElapsedTime() * effectiveSpeed;
  });

  const ringColor = isDark ? 0x34d399 : 0x059669;
  const nodeEmissive = isDark ? 0x34d399 : 0x059669;
  const nodeColor = isDark ? 0x6ee7b7 : 0x047857;

  return (
    <group rotation={rotation}>
      <mesh geometry={torusGeom}>
        <meshBasicMaterial color={ringColor} transparent opacity={isDark ? 0.35 : 0.45} />
      </mesh>
      <group ref={groupRef}>
        {nodes.map((node, i) => (
          <mesh key={i} position={[node.x, node.y, 0]} geometry={nodeGeom}>
            <meshStandardMaterial
              color={nodeColor}
              emissive={nodeEmissive}
              emissiveIntensity={0.6 + intensity * 0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AtmosphericCloud({
  isDark = true,
  intensity = 1.0,
}: {
  isDark?: boolean;
  intensity?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const cleanup = useSceneCleanup();
  const { particleCount } = useAdaptiveQuality();
  const count = particleCount > 0 ? particleCount : 120;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    let seed = 0x9e3779b9;
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const r = 1.6 + rand() * 2.2;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      col[i * 3] = isDark ? 0.2 : 0.05;
      col[i * 3 + 1] = isDark ? 0.8 : 0.6;
      col[i * 3 + 2] = isDark ? 0.6 : 0.45;
    }
    return [pos, col];
  }, [count, isDark]);

  const bufferGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useEffect(() => {
    cleanup.track(bufferGeom);
    cleanup.addCleanup(() => {
      if (pointsRef.current) disposeObject3D(pointsRef.current);
    });
  }, [bufferGeom, cleanup]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const spin = 0.08 * Math.max(0.4, intensity);
    pointsRef.current.rotation.y = clock.getElapsedTime() * spin;
    pointsRef.current.rotation.x = clock.getElapsedTime() * spin * 0.5;
  });

  return (
    <points ref={pointsRef} geometry={bufferGeom}>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={isDark ? 0.65 : 0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneLights({ isDark = true, intensity = 1.0 }: { isDark?: boolean; intensity?: number }) {
  const ambient = isDark ? 0.7 : 1.1;
  const directional = (isDark ? 1.4 : 1.6) * (0.8 + intensity * 0.4);
  const point = (0.9) * (0.8 + intensity * 0.3);
  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight position={[5, 8, 5]} intensity={directional} />
      <pointLight position={[-4, -3, -4]} intensity={point} color={isDark ? 0x34d399 : 0x10b981} />
      <pointLight position={[3, -4, 2]} intensity={0.7 * (0.8 + intensity * 0.2)} color={0x6366f1} />
    </>
  );
}

function CoreScene({
  isDark,
  intensity,
  speed,
  isInteracting,
  spatialResetTrigger,
}: {
  isDark: boolean;
  intensity: number;
  speed: number;
  isInteracting: boolean;
  spatialResetTrigger: number;
}) {
  const sceneGroup = useRef<THREE.Group>(null);
  const pointerPos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    pointerPos.current.targetX = 0;
    pointerPos.current.targetY = 0;
  }, [spatialResetTrigger]);

  useFrame((_, deltaRaw) => {
    if (!sceneGroup.current) return;
    const dt = Math.min(deltaRaw, 1 / 30);
    pointerPos.current.x = ease(pointerPos.current.x, pointerPos.current.targetX, 6, dt);
    pointerPos.current.y = ease(pointerPos.current.y, pointerPos.current.targetY, 6, dt);
    sceneGroup.current.rotation.y = pointerPos.current.x * 0.6;
    sceneGroup.current.rotation.x = -pointerPos.current.y * 0.4;
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isInteracting) return;
    pointerPos.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerPos.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  const liquidSpeed = 0.7 + speed * 0.6;

  return (
    <group ref={sceneGroup} onPointerMove={handlePointerMove}>
      <SceneLights isDark={isDark} intensity={intensity} />
      <CampusLiquidMetalCore
        radius={1.2}
        detail={5}
        intensity={intensity}
        speed={liquidSpeed}
        interactive={isInteracting}
      />
      <OrbitalRing radius={1.9} rotation={[0.4, 0.3, 0]} speed={0.3} intensity={speed} isDark={isDark} nodeCount={3} />
      <OrbitalRing radius={2.4} rotation={[-0.5, 0.4, 0.8]} speed={-0.22} intensity={speed} isDark={isDark} nodeCount={4} />
      <OrbitalRing radius={2.8} rotation={[0.8, -0.6, 0.2]} speed={0.16} intensity={speed} isDark={isDark} nodeCount={5} />
      <AtmosphericCloud isDark={isDark} intensity={speed} />
    </group>
  );
}

export type CampusCoreSize = "sm" | "md" | "lg" | "compact" | "default" | "hero";

export interface CampusCoreProps {
  className?: string;
  attendancePercent?: number;
  activeAssignments?: number;
  upcomingEvents?: number;
  xpPoints?: number;
  compact?: boolean;
  interactive?: boolean;
  size?: CampusCoreSize;
  metricLabel?: string;
  metricValue?: string;
  showTelemetry?: boolean;
}

export function CampusCore({
  className,
  attendancePercent = 88,
  activeAssignments = 4,
  upcomingEvents = 6,
  xpPoints = 1840,
  compact = false,
  interactive = false,
  size = "default",
  metricLabel,
  metricValue,
  showTelemetry = true,
}: CampusCoreProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [expanded, setExpanded] = useState(size === "lg" || size === "hero");
  const [resetKey, setResetKey] = useState(0);
  const spatialViewResetTrigger = useOSStore((s) => s.spatialViewResetTrigger);
  const activeMetric = useOSStore((s) => s.activeCoreDataMetric);

  const { visualIntensity, orbitalSpeed } = useMemo(() => {
    const attRatio = Math.min(attendancePercent / 100, 1.0);
    const loadBonus = Math.min(activeAssignments * 0.05, 0.25);
    const eventBonus = Math.min(upcomingEvents * 0.015, 0.15);

    let multiplier = 1.0;
    switch (activeMetric) {
      case "workload":
        multiplier = 1.15 + loadBonus;
        break;
      case "events":
        multiplier = 0.95 + eventBonus + Math.min(upcomingEvents * 0.02, 0.2);
        break;
      case "connectivity":
        multiplier = 0.9 + eventBonus * 0.8;
        break;
      case "academic":
      default:
        multiplier = 0.85 + attRatio * 0.5;
        break;
    }

    const intensity = Math.max(0.55, Math.min(1.8, multiplier));
    const speed = 0.55 + (intensity - 0.55) * 0.9;
    return { visualIntensity: intensity, orbitalSpeed: speed };
  }, [attendancePercent, activeAssignments, upcomingEvents, activeMetric]);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    useOSStore.getState().triggerSpatialReset();
  };

  const spatialReset = resetKey + spatialViewResetTrigger;

  return (
    <article
      aria-label="Campus Core 3D Living Telemetry System"
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm transition-all motion-tier-standard",
        expanded || size === "lg" || size === "hero"
          ? "min-h-[580px]"
          : compact || size === "sm" || size === "compact"
            ? "min-h-[320px]"
            : "min-h-[440px]",
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-between border-b border-border/70 p-5 bg-background/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold tracking-tight text-foreground">
                RBU Campus Core
              </h2>
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                Live Pulse
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                Metric: {activeMetric}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Living Digital Infrastructure &bull; Dynamic Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-lg border border-border/70 hover:bg-muted sm:size-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={handleReset}
            aria-label="Reset 3D Core camera and orientation"
            title="Reset Orientation"
          >
            <RotateCcw className="size-3.5 text-foreground" />
          </Button>
          {!compact && (
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-lg border border-border/70 hover:bg-muted sm:size-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? "Collapse core view" : "Expand core view"}
              title={expanded ? "Collapse View" : "Expand View"}
            >
              {expanded ? (
                <Minimize2 className="size-3.5 text-foreground" />
              ) : (
                <Maximize2 className="size-3.5 text-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <ImmersiveCanvas
          key={resetKey}
          camera={{ position: [0, 0, 5.2], fov: 45, near: 0.1, far: 100 }}
          sceneName="RBU Campus Core"
          fallback={
            <div className="flex h-full w-full items-center justify-center p-8 text-center bg-gradient-to-br from-card via-background to-muted/20">
              <div className="max-w-xs space-y-2">
                <div className="mx-auto size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Activity className="size-8" />
                </div>
                <p className="text-sm font-bold text-foreground">Campus Core Active</p>
                <p className="text-xs text-muted-foreground">
                  Tracking {attendancePercent}% attendance and {activeAssignments} deadlines.
                </p>
              </div>
            </div>
          }
        >
          <CoreScene
            isDark={isDark}
            intensity={visualIntensity}
            speed={orbitalSpeed}
            isInteracting={interactive}
            spatialResetTrigger={spatialReset}
          />
        </ImmersiveCanvas>
      </div>

      <div className="pointer-events-none relative z-10 flex justify-center py-4">
        <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-md">
          Drag to rotate spatial core &bull; Data-reactive topology
        </span>
      </div>

      {showTelemetry && (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-border/70 bg-background/50 p-4 backdrop-blur-md">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
              <ShieldCheck className="size-3 text-emerald-500" />
              <span>{metricLabel || "Attendance"}</span>
            </div>
            <p className="mt-1 font-display text-lg font-black text-foreground">
              {metricValue || `${attendancePercent}%`}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
              <Activity className="size-3 text-amber-500" />
              <span>Deadlines</span>
            </div>
            <p className="mt-1 font-display text-lg font-black text-foreground">
              {activeAssignments} Pending
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
              <Layers className="size-3 text-cyan-500" />
              <span>Events</span>
            </div>
            <p className="mt-1 font-display text-lg font-black text-foreground">
              {upcomingEvents} This Week
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
              <Sparkles className="size-3 text-primary" />
              <span>Telemetry XP</span>
            </div>
            <p className="mt-1 font-display text-lg font-black text-foreground">
              {xpPoints} XP
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

export default CampusCore;
