"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { ImmersiveCanvas } from "@/components/webgl/ImmersiveCanvas";
import { cn } from "@/lib/utils";

// Custom GLSL Liquid Metal Shaders
const vertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPress;
  uniform float uHover;
  uniform float uIntensity;
  uniform float uSpeed;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  // Simplex 2D noise helpers
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    
    // Wave calculations (uSpeed scales temporal frequency, uIntensity scales amplitude)
    float t = uTime * uSpeed;
    vec2 p = uv * 3.0;
    float wave1 = snoise(p + vec2(t * 0.25, t * 0.18)) * 0.12;
    float wave2 = snoise(p * 2.0 - vec2(t * 0.15, t * 0.22)) * 0.06;
    
    // Localized pointer distortion
    float dist = distance(uv, uPointer);
    float pointerWave = exp(-dist * 8.0) * sin(dist * 20.0 - t * 4.0) * 0.15 * uHover;
    
    // Press ripple shockwave
    float ripple = sin(dist * 24.0 - uPress * 6.0) * exp(-dist * 5.0) * (1.0 - uPress) * 0.2;

    float totalDisp = (wave1 + wave2 + pointerWave + ripple) * uIntensity;
    vDisplacement = totalDisp;

    vec3 newPosition = position + normal * totalDisp;
    
    // Finite difference approximation for smooth normals
    float offset = 0.01;
    float d1 = snoise((uv + vec2(offset, 0.0)) * 3.0 + uTime * 0.2);
    float d2 = snoise((uv - vec2(offset, 0.0)) * 3.0 + uTime * 0.2);
    float d3 = snoise((uv + vec2(0.0, offset)) * 3.0 + uTime * 0.2);
    float d4 = snoise((uv - vec2(0.0, offset)) * 3.0 + uTime * 0.2);
    
    vec3 tangentX = vec3(offset * 2.0, 0.0, (d1 - d2) * 0.1);
    vec3 tangentY = vec3(0.0, offset * 2.0, (d3 - d4) * 0.1);
    vec3 computedNormal = normalize(cross(tangentX, tangentY));

    vNormal = normalize(normalMatrix * computedNormal);
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uIsDark;
  uniform float uHover;
  uniform float uFocus;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel reflection
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
    
    // Controlled metallic light model
    vec3 lightDir1 = normalize(vec3(0.6, 0.8, 1.0));
    vec3 lightDir2 = normalize(vec3(-0.8, -0.4, 0.6));
    
    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0);
    
    vec3 half1 = normalize(lightDir1 + viewDir);
    float spec1 = pow(max(dot(normal, half1), 0.0), 32.0);
    
    vec3 half2 = normalize(lightDir2 + viewDir);
    float spec2 = pow(max(dot(normal, half2), 0.0), 20.0);

    // Subtle chromatic dispersion along edges
    float dispersion = vDisplacement * 1.5;
    vec3 tint;
    
    if (uIsDark > 0.5) {
      // Dark Mode: Deep metallic graphite, obsidian, subtle emerald/cyan iridescent sheen
      vec3 baseColor = vec3(0.06, 0.07, 0.09);
      vec3 metallicColor = vec3(0.20, 0.23, 0.28);
      vec3 accentColor = vec3(0.18, 0.82, 0.60); // Emerald/mint CampusOS accent
      vec3 rimColor = vec3(0.35, 0.45, 0.60);

      tint = mix(baseColor, metallicColor, diff1 * 0.7 + diff2 * 0.3);
      tint += spec1 * vec3(0.9, 0.95, 1.0) * 0.9;
      tint += spec2 * accentColor * 0.5;
      tint += fresnel * rimColor * 0.8;
      tint += sin(dispersion * 10.0 + vec3(0.0, 0.5, 1.0)) * 0.035 * uHover;

      // Keyboard focus accessible halo
      tint += uFocus * accentColor * 0.35;
    } else {
      // Light Mode: Crisp platinum, architectural brushed silver, subtle cyan reflection
      vec3 baseColor = vec3(0.88, 0.90, 0.92);
      vec3 metallicColor = vec3(0.98, 0.99, 1.0);
      vec3 accentColor = vec3(0.10, 0.65, 0.45); // Deep emerald
      vec3 rimColor = vec3(0.70, 0.75, 0.85);

      tint = mix(baseColor, metallicColor, diff1 * 0.8 + diff2 * 0.4);
      tint += spec1 * vec3(1.0, 1.0, 1.0) * 0.95;
      tint += spec2 * accentColor * 0.35;
      tint += fresnel * rimColor * 0.5;
      tint += sin(dispersion * 8.0 + vec3(0.0, 0.4, 0.8)) * 0.02 * uHover;

      // Keyboard focus accessible halo
      tint += uFocus * accentColor * 0.3;
    }

    gl_FragColor = vec4(tint, 1.0);
  }
`;

function LiquidMetalMesh({
  interactive = true,
  onPress,
  isFocused = false,
  intensity = 1,
  speed = 1,
}: {
  interactive?: boolean;
  onPress?: () => void;
  isFocused?: boolean;
  intensity?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const pointerRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const hoverRef = useRef(0);
  const pressRef = useRef(1.0); // 1.0 means idle
  const focusRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPress: { value: 1.0 },
      uHover: { value: 0.0 },
      uFocus: { value: 0.0 },
      uIsDark: { value: isDark ? 1.0 : 0.0 },
      uIntensity: { value: Math.max(0, intensity) },
      uSpeed: { value: Math.max(0, speed) },
    }),
    // Only re-create on theme flip; intensity/speed are pushed via effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDark]
  );

  useEffect(() => {
    uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
  }, [isDark, uniforms]);

  useEffect(() => {
    uniforms.uIntensity.value = Math.max(0, intensity);
  }, [intensity, uniforms]);

  useEffect(() => {
    uniforms.uSpeed.value = Math.max(0, speed);
  }, [speed, uniforms]);

  useEffect(() => {
    focusRef.current = isFocused ? 1.0 : 0.0;
  }, [isFocused]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;

    // Smooth inertia for pointer
    pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.08;
    pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.08;
    uniforms.uPointer.value.set(pointerRef.current.x, pointerRef.current.y);

    // Eased hover transition
    uniforms.uHover.value += (hoverRef.current - uniforms.uHover.value) * 0.1;

    // Eased focus transition
    uniforms.uFocus.value += (focusRef.current - uniforms.uFocus.value) * 0.12;

    // Press decay
    if (pressRef.current < 1.0) {
      pressRef.current += delta * 1.5;
      if (pressRef.current > 1.0) pressRef.current = 1.0;
      uniforms.uPress.value = pressRef.current;
    }
  });

  const handlePointerMove = (e: any) => {
    if (!interactive) return;
    if (e.uv) {
      pointerRef.current.targetX = e.uv.x;
      pointerRef.current.targetY = e.uv.y;
    }
    hoverRef.current = 1.0;
  };

  const handlePointerLeave = () => {
    hoverRef.current = 0.0;
  };

  const handlePointerDown = () => {
    if (!interactive) return;
    pressRef.current = 0.0;
    uniforms.uPress.value = 0.0;
    onPress?.();
  };

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[4.2, 4.2, 72, 72]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export interface CampusLiquidMetalProps {
  className?: string;
  interactive?: boolean;
  /** Displacement amplitude multiplier. Higher = more molten motion. */
  intensity?: number;
  /** Animation speed multiplier. `1` is the authored base speed. */
  speed?: number;
  onPress?: () => void;
  label?: string;
  badge?: string;
  statusText?: string;
}

export function CampusLiquidMetal({
  className,
  interactive = true,
  intensity = 1,
  speed = 1,
  onPress,
  label = "CampusOS Liquid Material",
  badge = "Spatial Material Tier 1",
  statusText = "Active Surface",
}: CampusLiquidMetalProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      tabIndex={interactive ? 0 : -1}
      role={interactive ? "button" : undefined}
      aria-label={label}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPress?.();
        }
      }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/40 transition-all duration-300",
        interactive && "cursor-pointer hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0">
        <ImmersiveCanvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          sceneName="CampusOS Liquid Metal"
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-card via-background to-muted/30 p-6">
              <div className="size-32 rounded-full bg-gradient-to-tr from-primary/30 to-emerald-400/20 blur-xl" />
            </div>
          }
        >
          <LiquidMetalMesh
            interactive={interactive}
            onPress={onPress}
            isFocused={isFocused}
            intensity={intensity}
            speed={speed}
          />
        </ImmersiveCanvas>
      </div>

      {/* Foreground Accessible Overlay */}
      <div className="relative z-10 flex items-start justify-between p-5 pointer-events-none">
        <div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-primary">
            {badge}
          </span>
          <p className="mt-2 text-sm font-bold text-foreground drop-shadow-xs">{label}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{statusText}</span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-border/40 bg-background/30 p-3.5 backdrop-blur-sm pointer-events-none">
        <span className="text-[11px] text-muted-foreground">
          {interactive ? "Tap or drag to deform material" : "Ambient State"}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/80">WebGL2 · Progressive Mesh</span>
      </div>
    </div>
  );
}
