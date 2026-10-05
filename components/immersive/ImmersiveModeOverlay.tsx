"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/lib/os-store";
import { CampusCore } from "@/components/immersive/CampusCoreDynamic";
import { Button } from "@/components/ui/button";
import {
  X,
  Compass,
  Activity,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Link from "next/link";
import { CURRENT_STUDENT, TIMETABLE, EVENTS } from "@/lib/campus-data";

export function ImmersiveModeOverlay() {
  const { isImmersiveMode, setMode } = useOSStore();
  const nextClass = TIMETABLE[2];
  const nextEvent = EVENTS[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isImmersiveMode) {
        setMode("normal");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isImmersiveMode, setMode]);

  return (
    <AnimatePresence>
      {isImmersiveMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 bg-background/95 backdrop-blur-2xl text-foreground overflow-y-auto"
        >
          {/* Top Bar HUD */}
          <div className="flex items-center justify-between border-b border-border/40 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h1 className="font-display text-lg font-black tracking-tight text-foreground">
                  RBU SPATIAL CORE · IMMERSIVE RUNWAY
                </h1>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Node RBU-NAGPUR · Academic Year {CURRENT_STUDENT.year} ({CURRENT_STUDENT.branch})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("normal")}
                className="gap-2 rounded-full text-xs font-semibold"
              >
                <Minimize2 className="size-3.5" />
                Exit Immersive (Esc)
              </Button>
            </div>
          </div>

          {/* Central Spatial Theater */}
          <div className="my-auto py-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 max-w-6xl mx-auto w-full">
            {/* Left Spatial Flight Path */}
            <div className="space-y-4 max-w-sm w-full">
              <div className="rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-md space-y-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  Next Scheduled Orbit
                </span>
                <h3 className="font-display text-base font-bold text-foreground">
                  {nextClass ? nextClass.title : "No Classes Scheduled"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {nextClass ? `${nextClass.day} · ${nextClass.time} · Room ${nextClass.room}` : "Academic runway clear"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-md space-y-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                  Marquee Campus Gathering
                </span>
                <h3 className="font-display text-base font-bold text-foreground truncate">
                  {nextEvent.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {nextEvent.date} · {nextEvent.location}
                </p>
              </div>
            </div>

            {/* Center: Hero 3D Campus Core */}
            <div className="flex flex-col items-center justify-center">
              <CampusCore
                size="hero"
                metricLabel="University Synchronized"
                metricValue="100% OPERATIONAL"
                showTelemetry={true}
              />
            </div>

            {/* Right Telemetry Column */}
            <div className="space-y-4 max-w-sm w-full">
              <div className="rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-md space-y-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  Academic Trajectory
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-foreground">8.42</span>
                  <span className="font-mono text-xs text-muted-foreground">Cumulative GPA</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Class Rank #14 of 180 Students · 64 of 120 Credits Earned
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  render={<Link href="/dashboard" />}
                  nativeButton={false}
                  className="flex-1 rounded-xl text-xs font-semibold gap-1.5"
                  onClick={() => setMode("normal")}
                >
                  Dashboard
                  <ArrowRight className="size-3.5" />
                </Button>
                <Button
                  render={<Link href="/campus-ai" />}
                  nativeButton={false}
                  variant="outline"
                  className="flex-1 rounded-xl text-xs font-semibold gap-1.5"
                  onClick={() => setMode("normal")}
                >
                  Campus AI
                  <Sparkles className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Navigation Bar */}
          <div className="border-t border-border/40 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px]">RBU CAMPUSOS KERNEL 2.4</span>
              <span>·</span>
              <span className="font-mono text-[10px]">WEBGL2 SPATIAL LAYER ACTIVE</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/map" onClick={() => setMode("normal")} className="hover:text-foreground">
                3D Map
              </Link>
              <Link href="/timetable" onClick={() => setMode("normal")} className="hover:text-foreground">
                Timetable
              </Link>
              <Link href="/notes" onClick={() => setMode("normal")} className="hover:text-foreground">
                Study Hub
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
