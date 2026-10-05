"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import { MAP_PLACES, type MapPlace } from "@/lib/campus-data";
import { useAdaptiveQuality } from "@/components/webgl/useAdaptiveQuality";
import { SceneErrorBoundary } from "@/components/webgl/SceneErrorBoundary";
import { useVisibilityPause } from "@/components/webgl/useVisibilityPause";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  RotateCcw,
  Layers,
  MapPin,
  Compass,
  Building,
  Clock,
  Sparkles,
  ArrowRight,
  Maximize2,
} from "lucide-react";

interface SpatialCampusMapProps {
  onSelectPlace?: (place: MapPlace) => void;
  selectedPlace?: MapPlace | null;
}

export function SpatialCampusMap(props: SpatialCampusMapProps) {
  return (
    <SceneErrorBoundary fallbackTitle="Spatial Map Standby">
      <SpatialCampusMapCanvas {...props} />
    </SceneErrorBoundary>
  );
}

function SpatialCampusMapCanvas({ onSelectPlace, selectedPlace }: SpatialCampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const { dpr, webglSupported, isLowPower } = useAdaptiveQuality();
  const isVisible = useVisibilityPause(containerRef);
  const prefersReduced = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const [cameraResetCount, setCameraResetCount] = useState(0);

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : true;

  // 3D Campus Building coordinate anchors derived from MAP_PLACES
  const buildingNodes = useMemo(() => {
    return MAP_PLACES.map((p, idx) => {
      // Map percentage (0-100) to 3D space (-12 to +12)
      const posX = ((p.x + p.w / 2) - 50) * 0.28;
      const posZ = ((p.y + p.h / 2) - 50) * 0.24;
      const height = (p.w + p.h) * 0.08 + 0.8;
      const color =
        p.kind === "Academic" ? (isDark ? 0x38bdf8 : 0x0284c7) :
        p.kind === "Lab" ? (isDark ? 0x10b981 : 0x059669) :
        p.kind === "Facility" ? (isDark ? 0xf59e0b : 0xd97706) :
        p.kind === "Social" ? (isDark ? 0xa855f7 : 0x9333ea) :
        (isDark ? 0x64748b : 0x475569);

      return {
        ...p,
        posX,
        posZ,
        height,
        color,
        index: idx,
      };
    });
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !webglSupported || !isVisible || viewMode !== "3d") return;

    let animId: number;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x090d16 : 0xf1f5f9, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialCamPos = new THREE.Vector3(0, 14, 18);
    camera.position.copy(initialCamPos);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isLowPower,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      renderer.setClearColor(isDark ? 0x090d16 : 0xf8fafc, 1);
    } catch {
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(isDark ? 0x1e293b : 0xffffff, isDark ? 2.0 : 2.5);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xffffff, isDark ? 2.5 : 2.8);
    sun.position.set(15, 25, 15);
    scene.add(sun);

    const fillLight = new THREE.DirectionalLight(isDark ? 0x38bdf8 : 0xbae6fd, isDark ? 1.5 : 1.0);
    fillLight.position.set(-15, 10, -15);
    scene.add(fillLight);

    // Ground Plane with Grid
    const groundGeo = new THREE.PlaneGeometry(36, 36);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0f172a : 0xe2e8f0,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(36, 36, isDark ? 0x334155 : 0xcbd5e1, isDark ? 0x1e293b : 0xe2e8f0);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Campus Roads / Pathways
    const roadGroup = new THREE.Group();
    const roadMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x1e293b : 0xd1d5db,
      transparent: true,
      opacity: 0.8,
    });

    const mainRoadGeo = new THREE.PlaneGeometry(32, 1.2);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(0, 0.01, 1);
    roadGroup.add(mainRoad);

    const crossRoadGeo = new THREE.PlaneGeometry(1.2, 32);
    const crossRoad = new THREE.Mesh(crossRoadGeo, roadMat);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.set(-2, 0.01, 0);
    roadGroup.add(crossRoad);
    scene.add(roadGroup);

    // Building Meshes Map
    const meshMap = new Map<THREE.Mesh, (typeof buildingNodes)[0]>();
    const buildingMeshes: THREE.Mesh[] = [];

    buildingNodes.forEach((node) => {
      const geo = new THREE.BoxGeometry(2.4, node.height, 2.2);
      const isSelected = selectedPlace?.id === node.id;

      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.35,
        metalness: 0.65,
        emissive: node.color,
        emissiveIntensity: isSelected ? 0.6 : isDark ? 0.15 : 0.05,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(node.posX, node.height / 2, node.posZ);
      mesh.userData = { height: node.height };
      scene.add(mesh);

      // Accent top cap
      const capGeo = new THREE.BoxGeometry(2.45, 0.1, 2.25);
      const capMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0xffffff : 0x0f172a,
        roughness: 0.2,
        metalness: 0.8,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(0, node.height / 2 + 0.05, 0);
      mesh.add(cap);

      // Beacon pole
      const beaconPoleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2);
      const beaconMat = new THREE.MeshBasicMaterial({ color: node.color });
      const beaconPole = new THREE.Mesh(beaconPoleGeo, beaconMat);
      beaconPole.position.set(0, node.height / 2 + 0.6, 0);
      mesh.add(beaconPole);

      // Pulsing Beacon Light
      const beaconLightGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const beaconLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const beaconLight = new THREE.Mesh(beaconLightGeo, beaconLightMat);
      beaconLight.position.set(0, node.height / 2 + 1.2, 0);
      mesh.add(beaconLight);

      meshMap.set(mesh, node);
      buildingMeshes.push(mesh);
    });

    // Orbit & Camera Controls (Smooth damping mouse drag)
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const spherical = { radius: 24, theta: 0.3, phi: Math.PI / 3.5 };

    const updateCameraFromSpherical = () => {
      // Clamp phi to prevent flip
      spherical.phi = Math.max(0.2, Math.min(Math.PI / 2.3, spherical.phi));
      spherical.radius = Math.max(10, Math.min(36, spherical.radius));

      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    };

    updateCameraFromSpherical();

    // Focus camera if a place is selected
    if (selectedPlace) {
      const activeNode = buildingNodes.find((b) => b.id === selectedPlace.id);
      if (activeNode) {
        spherical.theta = Math.atan2(activeNode.posX, activeNode.posZ) + 0.2;
        updateCameraFromSpherical();
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        prevMouse = { x: e.clientX, y: e.clientY };

        spherical.theta -= deltaX * 0.007;
        spherical.phi -= deltaY * 0.007;
        updateCameraFromSpherical();
      } else {
        // Raycasting for building hover
        const rect = canvas.getBoundingClientRect();
        const pointer = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(buildingMeshes, false);

        if (intersects.length > 0 && intersects[0]) {
          const hit = meshMap.get(intersects[0].object as THREE.Mesh);
          if (hit) setHoveredBuilding(hit.name);
          canvas.style.cursor = "pointer";
        } else {
          setHoveredBuilding(null);
          canvas.style.cursor = isDragging ? "grabbing" : "grab";
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes, false);

      if (intersects.length > 0 && intersects[0]) {
        const hit = meshMap.get(intersects[0].object as THREE.Mesh);
        if (hit && onSelectPlace) {
          onSelectPlace(hit);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius += e.deltaY * 0.02;
      updateCameraFromSpherical();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // Touch controls for mobile
    let prevTouchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && e.touches[0]) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && e.touches[0] && e.touches[1]) {
        prevTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && e.touches[0] && isDragging) {
        const deltaX = e.touches[0].clientX - prevMouse.x;
        const deltaY = e.touches[0].clientY - prevMouse.y;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        spherical.theta -= deltaX * 0.008;
        spherical.phi -= deltaY * 0.008;
        updateCameraFromSpherical();
      } else if (e.touches.length === 2 && e.touches[0] && e.touches[1]) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = dist - prevTouchDist;
        spherical.radius = Math.max(10, Math.min(36, spherical.radius - diff * 0.05));
        prevTouchDist = dist;
        updateCameraFromSpherical();
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    // Resize
    const onResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("resize", onResize);

    // Render loop
    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();

      // Gentle auto-rotation when user isn't interacting & reduced motion isn't requested
      if (!isDragging && !prefersReduced) {
        spherical.theta += 0.0012;
        updateCameraFromSpherical();
      }

      // Animate beacon heights & gentle hover breathing
      buildingMeshes.forEach((mesh, i) => {
        const pole = mesh.children[1];
        const beacon = mesh.children[2];
        if (pole && beacon) {
          const bounce = Math.sin(elapsed * 2.5 + i * 0.8) * 0.15;
          const nodeHeight = (mesh.userData?.height as number) || 2.0;
          beacon.position.y = nodeHeight / 2 + 1.2 + bounce;
        }
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);

      scene.clear();
      renderer.dispose();
    };
  }, [dpr, webglSupported, isVisible, isDark, isLowPower, buildingNodes, selectedPlace, onSelectPlace, cameraResetCount, prefersReduced, viewMode]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border/60 surface"
    >
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Compass className="size-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">
              RBU Spatial Wayfinding
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Interactive 3D campus terrain · Real-time facility nodes
            </p>
          </div>
        </div>

        {/* View Mode & Camera Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-muted/50 p-1">
            <Button
              variant={viewMode === "3d" ? "default" : "ghost"}
              size="sm"
              className="h-7 rounded-lg px-2.5 text-xs font-semibold"
              onClick={() => setViewMode("3d")}
            >
              <Layers className="mr-1.5 size-3" />
              3D Spatial
            </Button>
            <Button
              variant={viewMode === "2d" ? "default" : "ghost"}
              size="sm"
              className="h-7 rounded-lg px-2.5 text-xs font-semibold"
              onClick={() => setViewMode("2d")}
            >
              2D Schematic
            </Button>
          </div>

          {viewMode === "3d" && (
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-xl"
              onClick={() => setCameraResetCount((c) => c + 1)}
              title="Reset Camera Orientation"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* 3D Canvas / 2D Schematic Content Area */}
      <div className="relative aspect-[16/10] min-h-[360px] w-full overflow-hidden bg-background/50">
        {viewMode === "3d" ? (
          <>
            <canvas
              ref={canvasRef}
              className="h-full w-full block cursor-grab active:cursor-grabbing outline-none"
              style={{ touchAction: "none" }}
            />

            {/* Hovered Building Tooltip HUD */}
            {hoveredBuilding && (
              <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-xl border border-border/80 bg-background/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
                <MapPin className="size-3.5 text-primary" />
                <span className="font-display text-xs font-semibold text-foreground">
                  {hoveredBuilding}
                </span>
                <span className="text-[10px] text-muted-foreground">Click to inspect</span>
              </div>
            )}

            {/* Floating Navigation Instructions */}
            <div className="pointer-events-none absolute right-4 bottom-4 z-10 hidden sm:flex items-center gap-2 rounded-lg bg-background/80 px-2.5 py-1 text-[10px] font-mono text-muted-foreground backdrop-blur-sm">
              <span>Drag to Orbit</span>
              <span>·</span>
              <span>Scroll to Zoom</span>
              <span>·</span>
              <span>Click to Focus</span>
            </div>
          </>
        ) : (
          /* Accessible 2D Schematic Alternative */
          <div className="relative h-full w-full p-4 overflow-hidden">
            <div className="absolute left-[5%] top-[48%] h-8 w-[88%] -rotate-3 rounded-full bg-border/40" />
            <div className="absolute left-[45%] top-[7%] h-[85%] w-8 rotate-6 rounded-full bg-border/40" />
            {MAP_PLACES.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onSelectPlace?.(place)}
                  className={cn(
                    "absolute rounded-xl border p-2 text-left text-caption shadow-sm transition hover:scale-105",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                      : "border-border bg-card/95 hover:border-primary/40 text-foreground"
                  )}
                  style={{
                    left: `${place.x}%`,
                    top: `${place.y}%`,
                    width: `${place.w}%`,
                    minHeight: `${place.h}%`,
                  }}
                >
                  <span className="font-semibold block truncate">{place.name}</span>
                  <span className="mt-0.5 block opacity-70 text-[10px] truncate">{place.kind}</span>
                </button>
              );
            })}
            <p className="absolute bottom-3 left-4 text-[10px] font-mono text-muted-foreground">
              2D Campus Schematic · High-contrast view
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
