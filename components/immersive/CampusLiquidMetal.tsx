"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import { useAdaptiveQuality } from "@/components/webgl/useAdaptiveQuality";
import { SceneErrorBoundary } from "@/components/webgl/SceneErrorBoundary";
import { useVisibilityPause } from "@/components/webgl/useVisibilityPause";
import { cn } from "@/lib/utils";

interface CampusLiquidMetalProps {
  className?: string;
  intensity?: number;
  speed?: number;
  interactive?: boolean;
  label?: string;
  onClick?: () => void;
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPress;

  void main() {
    vUv = uv;
    vPosition = position;
    
    // Wave displacement based on pointer and time
    vec3 pos = position;
    float dist = distance(uv, uPointer);
    float wave = sin(dist * 12.0 - uTime * 2.5) * exp(-dist * 2.5) * 0.18;
    float ripple = sin(dist * 24.0 - uTime * 6.0) * exp(-dist * 4.0) * uPress * 0.35;
    
    pos.z += wave + ripple;
    vNormal = normalize(normalMatrix * (normal + vec3(0.0, 0.0, wave * 2.0)));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uIsDark;
  uniform float uIntensity;

  void main() {
    // Dynamic normal calculation
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    
    // Controlled Fresnel effect
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    
    // Flowing metallic reflection bands
    float band = sin(vUv.x * 6.0 + vUv.y * 4.0 + uTime * 1.2 + normal.x * 3.0);
    float band2 = cos(vUv.x * 4.0 - vUv.y * 8.0 - uTime * 0.8 + normal.y * 3.0);
    float flow = (band + band2) * 0.5;
    
    // Spectral chromatic dispersion
    float r = sin(flow * 3.1415 + 0.0) * 0.5 + 0.5;
    float g = sin(flow * 3.1415 + 1.2) * 0.5 + 0.5;
    float b = sin(flow * 3.1415 + 2.4) * 0.5 + 0.5;
    vec3 dispersion = vec3(r, g, b) * 0.22;
    
    // Dark mode vs Light mode palettes
    vec3 darkBase = vec3(0.08, 0.11, 0.16);
    vec3 darkHighlight = vec3(0.25, 0.65, 0.95);
    
    vec3 lightBase = vec3(0.88, 0.91, 0.95);
    vec3 lightHighlight = vec3(0.15, 0.55, 0.85);

    vec3 baseColor = mix(lightBase, darkBase, uIsDark);
    vec3 highlightColor = mix(lightHighlight, darkHighlight, uIsDark);

    // Final color composite
    vec3 color = baseColor + highlightColor * flow * uIntensity + dispersion * fresnel;
    color += vec3(fresnel * 0.45);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function CampusLiquidMetal(props: CampusLiquidMetalProps) {
  return (
    <SceneErrorBoundary fallbackTitle="Liquid Surface 2D">
      <LiquidMetalCanvas {...props} />
    </SceneErrorBoundary>
  );
}

function LiquidMetalCanvas({
  className,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
  label,
  onClick,
}: CampusLiquidMetalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const { dpr, webglSupported, isLowPower } = useAdaptiveQuality();
  const isVisible = useVisibilityPause(containerRef);
  const prefersReduced = useReducedMotion();

  const [pressPulse, setPressPulse] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : true;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !webglSupported || !isVisible) return;

    let animId: number;
    const width = canvas.clientWidth || 320;
    const height = canvas.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.z = 2.5;

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
    } catch {
      return;
    }

    const segments = isLowPower ? 32 : 64;
    const geometry = new THREE.PlaneGeometry(3.0, 2.0, segments, segments);

    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPress: { value: 0 },
      uIsDark: { value: isDark ? 1.0 : 0.0 },
      uIntensity: { value: intensity },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetPointer = new THREE.Vector2(0.5, 0.5);
    let pressVal = 0;

    const onPointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      targetPointer.x = (e.clientX - rect.left) / rect.width;
      targetPointer.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const onPointerDown = () => {
      pressVal = 1.0;
    };

    if (interactive) {
      canvas.addEventListener("mousemove", onPointerMove);
      canvas.addEventListener("mousedown", onPointerDown);
    }

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

    const clock = new THREE.Clock();

    const renderLoop = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime() * speed;

      // Pointer lerp
      uniforms.uPointer.value.lerp(targetPointer, 0.08);

      // Press decay
      if (pressVal > 0) {
        pressVal = Math.max(0, pressVal - delta * 2.0);
      }
      uniforms.uPress.value = pressVal;

      if (!prefersReduced) {
        uniforms.uTime.value = elapsed;
      }
      uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
      uniforms.uIntensity.value = intensity;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (interactive) {
        canvas.removeEventListener("mousemove", onPointerMove);
        canvas.removeEventListener("mousedown", onPointerDown);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [dpr, webglSupported, isVisible, isDark, isLowPower, intensity, speed, interactive, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 backdrop-blur-md shadow-lg transition-transform duration-300 hover:border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <canvas ref={canvasRef} className="h-full w-full block cursor-pointer" />
      {label && (
        <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
          <span className="text-[10px] text-muted-foreground">Liquid Core</span>
        </div>
      )}
    </div>
  );
}
