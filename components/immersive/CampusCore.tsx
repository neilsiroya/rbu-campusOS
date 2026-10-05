"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { ImmersiveCanvas } from "@/components/webgl/ImmersiveCanvas";
import { RotateCcw, Maximize2, Minimize2, Sparkles, Activity, Layers, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- CORE PROCEDURAL 3D ELEMENTS ---

function InnerTopologyCore({
  intensity = 1.0,
  isDark = true,
}: {
  intensity?: number;
  isDark?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.2, 5);
  }, []);

  useEffect(() => {
    originalPositions.current = geometry.attributes.position.array.slice() as Float32Array;
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !originalPositions.current) return;
    const t = clock.getElapsedTime() * 0.9;
    const pos = meshRef.current.geometry.attributes.position;
    const orig = originalPositions.current;

    for (let i = 0; i < pos.count; i++) {
      const u = i * 3;
      const ox = orig[u];
      const oy = orig[u + 1];
      const oz = orig[u + 2];

      const noise =
        Math.sin(ox * 2.2 + t) *
        Math.cos(oy * 2.2 + t * 0.8) *
        Math.sin(oz * 2.2 + t * 1.2) *
        0.18 *
        intensity;

      pos.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise);
    }
    pos.needsUpdate = true;

    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.2;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={isDark ? "#11221b" : "#e6f4ee"}
        metalness={0.92}
        roughness={0.2}
        emissive={isDark ? "#064e3b" : "#10b981"}
        emissiveIntensity={isDark ? 0.35 : 0.15}
        wireframe={false}
      />
    </mesh>
  );
}

function OrbitalRing({
  radius = 2.1,
  rotation = [0, 0, 0],
  speed = 0.4,
  isDark = true,
  nodeCount = 4,
}: {
  radius?: number;
  rotation?: [number, number, number];
  speed?: number;
  isDark?: boolean;
  nodeCount?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = clock.getElapsedTime() * speed;
  });

  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      list.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    }
    return list;
  }, [radius, nodeCount]);

  return (
    <group rotation={rotation}>
      {/* Structural Thin Torus Ring */}
      <mesh>
        <torusGeometry args={[radius, 0.016, 16, 100]} />
        <meshBasicMaterial
          color={isDark ? "#34d399" : "#059669"}
          transparent
          opacity={isDark ? 0.35 : 0.45}
        />
      </mesh>

      {/* Orbiting Spatial Data Nodes */}
      <group ref={groupRef}>
        {nodes.map((node, i) => (
          <mesh key={i} position={[node.x, node.y, 0]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial
              color={isDark ? "#6ee7b7" : "#047857"}
              emissive={isDark ? "#34d399" : "#059669"}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AtmosphericCloud({ isDark = true }: { isDark?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Emerald to Cyan gradient
      col[i * 3] = isDark ? 0.2 : 0.05;
      col[i * 3 + 1] = isDark ? 0.8 : 0.6;
      col[i * 3 + 2] = isDark ? 0.6 : 0.45;
    }
    return [pos, col];
  }, [isDark]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    pointsRef.current.rotation.x = clock.getElapsedTime() * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={isDark ? 0.65 : 0.55}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SceneLights({ isDark = true }: { isDark?: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.7 : 1.1} />
      <directionalLight position={[5, 8, 5]} intensity={isDark ? 1.4 : 1.6} />
      <pointLight position={[-4, -3, -4]} intensity={0.9} color={isDark ? "#34d399" : "#10b981"} />
      <pointLight position={[3, -4, 2]} intensity={0.7} color="#6366f1" />
    </>
  );
}

function CoreScene({
  isDark,
  intensity,
  isInteracting,
}: {
  isDark: boolean;
  intensity: number;
  isInteracting: boolean;
}) {
  const sceneGroup = useRef<THREE.Group>(null);
  const pointerPos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useFrame((_, delta) => {
    if (!sceneGroup.current) return;

    // Smooth inertia camera tilting
    pointerPos.current.x += (pointerPos.current.targetX - pointerPos.current.x) * 0.08;
    pointerPos.current.y += (pointerPos.current.targetY - pointerPos.current.y) * 0.08;

    sceneGroup.current.rotation.y = pointerPos.current.x * 0.6;
    sceneGroup.current.rotation.x = -pointerPos.current.y * 0.4;
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isInteracting) return;
    pointerPos.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerPos.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  return (
    <group ref={sceneGroup} onPointerMove={handlePointerMove}>
      <SceneLights isDark={isDark} />
      <InnerTopologyCore intensity={intensity} isDark={isDark} />
      {/* 3 Orthogonal Orbital Layers */}
      <OrbitalRing radius={1.9} rotation={[0.4, 0.3, 0]} speed={0.3} isDark={isDark} nodeCount={3} />
      <OrbitalRing radius={2.4} rotation={[-0.5, 0.4, 0.8]} speed={-0.22} isDark={isDark} nodeCount={4} />
      <OrbitalRing radius={2.8} rotation={[0.8, -0.6, 0.2]} speed={0.16} isDark={isDark} nodeCount={5} />
      <AtmosphericCloud isDark={isDark} />
    </group>
  );
}

// --- MAIN EXPORTED COMPONENT ---

export type CampusCoreSize = "sm" | "md" | "lg" | "compact" | "default" | "hero";

export interface CampusCoreProps {
  className?: string;
  attendancePercent?: number;
  activeAssignments?: number;
  upcomingEvents?: number;
  xpPoints?: number;
  compact?: boolean;
  /** Enables pointer parallax on the core. Defaults to `false` (static framing). */
  interactive?: boolean;
  /** Initial presentation size. `sm|compact` → compact, `md|default` → standard, `lg|hero` → expanded. */
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

  // Compute derived visual intensity from academic metrics
  const visualIntensity = useMemo(() => {
    const attRatio = Math.min(attendancePercent / 100, 1.0);
    const loadBonus = Math.min(activeAssignments * 0.05, 0.25);
    return 0.8 + attRatio * 0.4 + loadBonus;
  }, [attendancePercent, activeAssignments]);

  const handleReset = () => {
    setResetKey((k) => k + 1);
  };

  return (
    <article
      aria-label="Campus Core 3D Living Telemetry System"
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300",
        expanded || size === "lg" || size === "hero"
          ? "min-h-[580px]"
          : compact || size === "sm" || size === "compact"
            ? "min-h-[320px]"
            : "min-h-[440px]",
        className
      )}
    >
      {/* Top Header & Telemetry Badges */}
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
            </div>
            <p className="text-[11px] text-muted-foreground">
              Living Digital Infrastructure &bull; Dynamic Telemetry
            </p>
          </div>
        </div>

        {/* Viewport Control Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg border border-border/70 hover:bg-muted"
            onClick={handleReset}
            aria-label="Reset 3D Core Camera"
            title="Reset Orientation"
          >
            <RotateCcw className="size-3.5 text-foreground" />
          </Button>
          {!compact && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg border border-border/70 hover:bg-muted"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? "Collapse Core View" : "Expand Core View"}
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

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <ImmersiveCanvas
          key={resetKey}
          camera={{ position: [0, 0, 5.2], fov: 45 }}
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
          <CoreScene isDark={isDark} intensity={visualIntensity} isInteracting={interactive} />
        </ImmersiveCanvas>
      </div>

      {/* Center Interactive Hint */}
      <div className="pointer-events-none relative z-10 flex justify-center py-4">
        <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-md">
          Drag to rotate spatial core &bull; Data-reactive topology
        </span>
      </div>

      {/* Bottom Live Metric HUD (Accessible DOM Overlay) */}
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
