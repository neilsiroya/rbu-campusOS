"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import { useAdaptiveQuality } from "@/components/webgl/useAdaptiveQuality";
import { SceneErrorBoundary } from "@/components/webgl/SceneErrorBoundary";
import { useVisibilityPause } from "@/components/webgl/useVisibilityPause";
import { cn } from "@/lib/utils";
import { Sparkles, Activity, Layers, RotateCcw } from "lucide-react";

interface CampusCoreProps {
  className?: string;
  interactive?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
  metricLabel?: string;
  metricValue?: string;
  showTelemetry?: boolean;
}

export function CampusCore(props: CampusCoreProps) {
  return (
    <SceneErrorBoundary fallbackTitle="Campus Core 2D Reserve">
      <CampusCoreCanvas {...props} />
    </SceneErrorBoundary>
  );
}

function CampusCoreCanvas({
  className,
  interactive = true,
  size = "md",
  metricLabel = "Campus Connectivity",
  metricValue = "98.4%",
  showTelemetry = true,
}: CampusCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const { dpr, webglSupported, isLowPower } = useAdaptiveQuality();
  const isVisible = useVisibilityPause(containerRef);
  const prefersReduced = useReducedMotion();

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  // Sizes
  const sizeDims = {
    sm: "h-48 w-48",
    md: "h-72 w-72 md:h-80 md:w-80",
    lg: "h-96 w-96 md:h-[440px] md:w-[440px]",
    hero: "h-[360px] w-full sm:h-[440px] md:h-[520px]",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !webglSupported || !isVisible) return;

    let animationFrameId: number;
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 300;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // 3. Renderer setup
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
      renderer.setClearColor(0x000000, 0);
    } catch {
      return;
    }

    // 4. Color Palette configuration
    const primaryColor = isDark ? 0x38bdf8 : 0x0284c7; // Cyan / Azure
    const accentColor = isDark ? 0x10b981 : 0x059669; // Emerald
    const metalColor = isDark ? 0x1e293b : 0xe2e8f0; // Slate
    const ambientColor = isDark ? 0x0f172a : 0xf8fafc;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(ambientColor, isDark ? 1.5 : 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(primaryColor, isDark ? 2.5 : 3.0);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(accentColor, isDark ? 2.0 : 1.5);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // 6. Geometry: The Living Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // A. Central Geodesic Core
    const coreGeometry = new THREE.IcosahedronGeometry(1.15, 1);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: metalColor,
      metalness: 0.85,
      roughness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(coreMesh);

    // B. Wireframe outer shield lattice
    const wireGeometry = new THREE.IcosahedronGeometry(1.22, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    coreGroup.add(wireMesh);

    // C. Gyroscopic Orbital Rings (3 intersecting orbital planes)
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    const createRing = (radius: number, tube: number, color: number, rotX: number, rotY: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.9,
        roughness: 0.15,
        emissive: color,
        emissiveIntensity: isDark ? 0.3 : 0.1,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    };

    const ring1 = createRing(1.8, 0.025, primaryColor, Math.PI / 4, 0);
    const ring2 = createRing(2.1, 0.02, accentColor, -Math.PI / 3, Math.PI / 6);
    const ring3 = createRing(2.35, 0.018, isDark ? 0x94a3b8 : 0x64748b, Math.PI / 2.2, -Math.PI / 4);

    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);

    // D. Constellation Data Nodes (Instanced data satellites)
    const particleCount = isLowPower ? 30 : 64;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = 2.0 + (i % 3) * 0.4 + Math.sin(i) * 0.2;

      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: primaryColor,
      size: isDark ? 0.07 : 0.06,
      transparent: true,
      opacity: isDark ? 0.8 : 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // 7. Mouse / Pointer tracking with smooth damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width) * 2 - 1;
      mouse.targetY = -(clientY / rect.height) * 2 + 1;
    };

    const handlePointerLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handlePointerMove);
      canvas.addEventListener("mouseleave", handlePointerLeave);
    }

    // 8. Resize handler
    const handleResize = () => {
      if (!canvas) return;
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight, false);
    };

    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    const clock = new THREE.Clock();
    let pulseScale = 1.0;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Damped pointer follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!prefersReduced) {
        // Core rotation
        coreMesh.rotation.y += 0.4 * delta;
        coreMesh.rotation.x += 0.2 * delta;

        wireMesh.rotation.y -= 0.3 * delta;
        wireMesh.rotation.z += 0.15 * delta;

        // Gyroscopic ring precession
        ring1.rotation.z += 0.8 * delta;
        ring2.rotation.z -= 0.6 * delta;
        ring3.rotation.z += 0.5 * delta;

        // Group gentle tilt based on pointer
        coreGroup.rotation.y = mouse.x * 0.4 + elapsedTime * 0.05;
        coreGroup.rotation.x = -mouse.y * 0.4 + Math.sin(elapsedTime * 0.5) * 0.05;

        // Particle orbital pulsation
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          const origX = originalPositions[idx];
          const origY = originalPositions[idx + 1];
          const origZ = originalPositions[idx + 2];

          const wave = Math.sin(elapsedTime * 2.0 + i) * 0.08;
          posArray[idx] = origX * (1 + wave);
          posArray[idx + 1] = origY * (1 + wave);
          posArray[idx + 2] = origZ * (1 + wave);
        }
        posAttr.needsUpdate = true;
      }

      // Pulse decay if triggered
      if (pulseScale > 1.0) {
        pulseScale = Math.max(1.0, pulseScale - delta * 1.5);
        coreGroup.scale.set(pulseScale, pulseScale, pulseScale);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        canvas.removeEventListener("mousemove", handlePointerMove);
        canvas.removeEventListener("mouseleave", handlePointerLeave);
      }

      // Dispose Three.js objects
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [dpr, webglSupported, isVisible, isDark, isLowPower, interactive, prefersReduced, pulseCount]);

  const triggerPulse = () => {
    setPulseCount((c) => c + 1);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-col items-center justify-center select-none", className)}
    >
      {/* 3D Canvas Viewport */}
      <div
        className={cn(
          "relative overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-[1.02]",
          sizeDims[size]
        )}
        onClick={triggerPulse}
        role="button"
        tabIndex={0}
        aria-label="Campus Core 3D Node. Click to pulse university synchronization."
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerPulse();
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full outline-none"
          style={{ touchAction: "none" }}
        />

        {/* Ambient Focal Glow backdrop (bounded, non-expensive) */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl opacity-30 transition-opacity",
            isDark ? "bg-primary/20" : "bg-primary/15"
          )}
          aria-hidden="true"
        />
      </div>

      {/* Structured Telemetry HUD */}
      {showTelemetry && (
        <div className="mt-2 flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {metricLabel}
            </span>
            <span className="font-mono text-[11px] font-bold text-foreground">
              {metricValue}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Living telemetry node · Click to ping network
          </p>
        </div>
      )}
    </div>
  );
}
