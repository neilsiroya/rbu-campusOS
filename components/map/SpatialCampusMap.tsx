"use client";

import React, { useRef, useState } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";
import { ImmersiveCanvas } from "@/components/webgl/ImmersiveCanvas";
import { type MapPlace } from "@/lib/campus-data";
import { Navigation, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Building positions in 3D world space mapped from MAP_PLACES percentage coords
const BUILDING_COORDS: Record<string, { x: number; z: number; width: number; depth: number; height: number; color?: string }> = {
  admin: { x: -4.5, z: -3.8, width: 2.4, depth: 1.8, height: 1.4 },
  lt: { x: -1.2, z: -4.0, width: 3.2, depth: 2.0, height: 1.6 },
  cs: { x: 3.5, z: -3.6, width: 2.8, depth: 2.2, height: 2.2 },
  lab4: { x: 3.6, z: -1.2, width: 2.0, depth: 1.6, height: 1.2 },
  lib: { x: -1.2, z: -1.2, width: 2.8, depth: 2.0, height: 1.8 },
  quad: { x: -1.2, z: 1.2, width: 3.4, depth: 1.8, height: 0.2 }, // Open lawn
  plaza: { x: -4.5, z: 1.4, width: 2.2, depth: 2.0, height: 0.3 }, // Plaza
  aud: { x: 3.6, z: 1.4, width: 2.8, depth: 2.2, height: 2.0 },
  sport: { x: -4.5, z: 4.2, width: 3.2, depth: 2.2, height: 1.4 },
  cafe: { x: 0.2, z: 4.2, width: 2.4, depth: 1.8, height: 1.1 },
  med: { x: 4.0, z: 4.2, width: 2.2, depth: 1.8, height: 1.2 },
};

function BuildingMesh({
  place,
  isSelected,
  onSelect,
  isDark,
}: {
  place: MapPlace;
  isSelected: boolean;
  onSelect: () => void;
  isDark: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const config = BUILDING_COORDS[place.id] || { x: 0, z: 0, width: 2, depth: 2, height: 1.2 };

  const getCategoryColor = () => {
    switch (place.kind) {
      case "Academic":
        return isDark ? "#3b82f6" : "#2563eb";
      case "Lab":
        return isDark ? "#10b981" : "#059669";
      case "Facility":
        return isDark ? "#06b6d4" : "#0891b2";
      case "Service":
        return isDark ? "#f59e0b" : "#d97706";
      case "Social":
        return isDark ? "#ec4899" : "#db2777";
      default:
        return isDark ? "#64748b" : "#475569";
    }
  };

  const accentColor = getCategoryColor();

  return (
    <group position={[config.x, config.height / 2, config.z]}>
      {/* Building Physical Mass */}
      <mesh
        scale={isSelected ? 1.04 : 1}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[config.width, config.height, config.depth]} />
        <meshStandardMaterial
          color={
            isSelected
              ? accentColor
              : hovered
              ? isDark
                ? "#2a3642"
                : "#cbd5e1"
              : isDark
              ? "#1a222c"
              : "#e2e8f0"
          }
          metalness={0.7}
          roughness={0.3}
          emissive={isSelected || hovered ? accentColor : "#000000"}
          emissiveIntensity={isSelected ? 0.45 : hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Roof Edge Indicator Strip */}
      <mesh position={[0, config.height / 2 + 0.02, 0]}>
        <boxGeometry args={[config.width * 0.9, 0.02, config.depth * 0.9]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.6 : 0.25}
        />
      </mesh>

    </group>
  );
}

function GroundTerrain({ isDark }: { isDark: boolean }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Base Campus Ground Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial
          color={isDark ? "#0d1319" : "#f1f5f9"}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Subtle Campus Grid & Road System */}
      <gridHelper
        args={[18, 18, isDark ? "#22303c" : "#cbd5e1", isDark ? "#17222c" : "#e2e8f0"]}
        position={[0, 0, 0]}
      />

      {/* Main East-West Spine Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[15, 0.8]} />
        <meshBasicMaterial color={isDark ? "#1f2a36" : "#cbd5e1"} />
      </mesh>

      {/* North-South Spine Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.8, 13]} />
        <meshBasicMaterial color={isDark ? "#1f2a36" : "#cbd5e1"} />
      </mesh>
    </group>
  );
}

export interface SpatialCampusMapProps {
  selectedPlace: MapPlace | null;
  onSelectPlace: (place: MapPlace) => void;
  places: MapPlace[];
}

export function SpatialCampusMap({
  selectedPlace,
  onSelectPlace,
  places,
}: SpatialCampusMapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative h-full min-h-[460px] w-full overflow-hidden rounded-3xl border border-border/80 bg-card/40 shadow-sm">
      {/* 3D WebGL Canvas */}
      <div className="absolute inset-0 pointer-events-none sm:pointer-events-auto" aria-hidden="true">
        <ImmersiveCanvas
          camera={{ position: [0, 9, 11], fov: 42 }}
          sceneName="RBU 3D Spatial Campus Map"
          demand
          fallback={
            <div className="flex h-full w-full items-center justify-center p-8 text-center">
              <p className="text-sm text-foreground">The campus model is unavailable on this device. Use the places list to explore every location.</p>
            </div>
          }
        >
          <ambientLight intensity={isDark ? 0.8 : 1.2} />
          <directionalLight
            position={[10, 15, 8]}
            intensity={isDark ? 1.5 : 1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-8, 6, -8]} intensity={0.8} color="#34d399" />

          <GroundTerrain isDark={isDark} />

          {places.map((place) => (
            <BuildingMesh
              key={place.id}
              place={place}
              isSelected={selectedPlace?.id === place.id}
              onSelect={() => onSelectPlace(place)}
              isDark={isDark}
            />
          ))}

          <OrbitControls
            ref={controlsRef}
            enableDamping
            enableZoom={false}
            dampingFactor={0.08}
            minDistance={6}
            maxDistance={18}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.3} // Clamp so user cannot view from underground
            target={[0, 0, 0]}
          />
        </ImmersiveCanvas>
      </div>

      {/* Top Map HUD Controls */}
      <div className="pointer-events-none relative z-10 flex items-center justify-between p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-3 py-1.5 shadow-md backdrop-blur-md">
          <Navigation className="size-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Campus model</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-primary">
            3D Orbit
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCamera}
            className="h-8 gap-1.5 rounded-xl border border-border/80 bg-background/80 px-2.5 text-xs backdrop-blur-md hover:bg-muted"
            title="Reset Map Orientation"
            aria-label="Reset map orientation"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset Camera</span>
          </Button>
        </div>
      </div>

      {/* Bottom Spatial Interaction Hint */}
      {selectedPlace && <p className="pointer-events-none absolute bottom-14 left-4 z-10 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold">{selectedPlace.name}</p>}
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 backdrop-blur-md">
          <span className="hidden sm:inline">Select a building &bull; Drag to look around</span>
          <span className="sm:hidden">Choose a place from the list below</span>
        </span>
        <span className="hidden sm:inline-block rounded-full border border-border/60 bg-background/70 px-2.5 py-1 font-mono text-[10px] backdrop-blur-md">
          {places.length} sample locations
        </span>
      </div>
    </div>
  );
}
