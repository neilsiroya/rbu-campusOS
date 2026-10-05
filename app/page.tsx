"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Map,
  MessageCircleHeart,
  Sparkles,
  GraduationCap,
  Compass,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "@/components/os/BrandMark";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/motion";
import { CampusCore } from "@/components/immersive/CampusCoreDynamic";
import { LiveSystemBar } from "@/components/landing/LiveSystemBar";

const lanes = [
  {
    icon: MessageCircleHeart,
    title: "The campus conversation",
    text: "Feed, confessions, clubs, people, and a kinder peer community.",
    href: "/feed",
  },
  {
    icon: Map,
    title: "The campus, legible & spatial",
    text: "An interactive 3D spatial map, facility schedules, and student services.",
    href: "/map",
  },
  {
    icon: CalendarDays,
    title: "A week with momentum",
    text: "Events, hackathons, internships, and placement discovery in one cohesive stream.",
    href: "/events",
  },
  {
    icon: Bot,
    title: "Campus-aware intelligence",
    text: "A resident AI knowledge layer for places, events, clubs, and timetables.",
    href: "/campus-ai",
  },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Top Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark href="/" />
        <div className="flex items-center gap-3">
          <Button
            render={<Link href="/auth/login" />}
            nativeButton={false}
            variant="ghost"
            className="min-h-11 rounded-full px-5 text-xs font-semibold"
          >
            Log in
          </Button>
          <Button
            render={<Link href="/dashboard" />}
            nativeButton={false}
            className="min-h-11 rounded-full px-6 text-xs font-semibold shadow-md shadow-primary/20"
          >
            Launch CampusOS
          </Button>
        </div>
      </header>

      {/* Hero Section with 3D Spatial Campus Core */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12 lg:pt-16">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
              RBU OS 2.4 · Spatial University Kernel
            </span>
          </div>

          <h1 className="max-w-3xl font-display text-[clamp(2.5rem,7.5vw,4.25rem)] leading-[0.92] tracking-tight text-foreground">
            ONE CAMPUS.
            <br />
            ONE IDENTITY.
            <br />
            <span className="text-primary italic">EVERY EXPERIENCE.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A futuristic operating system for university life. Academics, peer exchange,
            3D spatial wayfinding, and resident intelligence unified into one living interface.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <MagneticButton
              as={Link}
              href="/dashboard"
              size="lg"
              className="min-h-12 rounded-full px-7 text-sm font-semibold shadow-xl shadow-primary/25"
            >
              Enter Campus Command
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </MagneticButton>

            <Button
              render={<Link href="/map" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="min-h-12 rounded-full px-6 text-sm font-semibold"
            >
              <Compass className="mr-2 size-4 text-primary" />
              Explore 3D Map
            </Button>
          </div>

          {/* Live campus status — real clock + real academic state */}
          <LiveSystemBar />

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid max-w-lg grid-cols-1 gap-4 border-t border-border/60 pt-6 sm:grid-cols-3 sm:gap-3">
            <div>
              <p className="font-display text-2xl font-black text-foreground">100%</p>
              <p className="text-[11px] text-muted-foreground">Digital Campus</p>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-foreground">24</p>
              <p className="text-[11px] text-muted-foreground">Active Hubs</p>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-primary">0ms</p>
              <p className="text-[11px] text-muted-foreground">Peer Platform Fee</p>
            </div>
          </div>
        </div>

        {/* 3D Campus Core Interactive Theater */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="relative flex flex-col items-center justify-center rounded-[2.5rem] border border-border/70 bg-gradient-to-b from-card/80 to-card/40 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="w-full flex items-center justify-between pb-3 border-b border-border/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
                RBU Campus Core
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              WebGL2 Engine Active
            </span>
          </div>

          <div className="w-full flex items-center justify-center py-4">
            <CampusCore
              size="lg"
              metricLabel="University Synchronization"
              metricValue="LIVE FEED ACTIVE"
              showTelemetry={true}
            />
          </div>

          {/* Mini Interactive Preview Strip */}
          <div className="grid w-full grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs">
            <Link
              href="/academics"
              className="rounded-xl border border-border/40 bg-background/50 p-2.5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-1.5 text-primary font-semibold text-[11px]">
                <GraduationCap className="size-3.5" />
                <span>Academics</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                Track GPA & Attendance
              </p>
            </Link>

            <Link
              href="/campus-ai"
              className="rounded-xl border border-border/40 bg-background/50 p-2.5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[11px]">
                <Sparkles className="size-3.5" />
                <span>Campus AI</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                Ask about labs & events
              </p>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Primary Operating Layers Grid */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
            Architecture
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Built as a spatial operating system, not a siloed portal.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything connects. Academics, peer exchange, campus wayfinding, and resident intelligence.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-4 lg:grid-cols-2">
          {lanes.map(({ icon: Icon, title, text, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-28 items-start gap-4 border-t border-border/80 py-6 transition-all hover:border-primary/60"
            >
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {title}
                  </span>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                  {text}
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Closing Marquee Card */}
        <div className="mt-16 rounded-[2rem] bg-foreground px-7 py-10 text-background sm:px-10">
          <p className="text-xs uppercase tracking-[.22em] opacity-65 font-mono">
            RBU CampusOS
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl font-display text-3xl sm:text-4xl leading-tight">
              One home for the life around your degree.
            </h2>
            <MagneticButton
              as={Link}
              href="/dashboard"
              className="min-h-11 rounded-full bg-background text-foreground hover:bg-background/90 text-xs font-semibold px-6"
            >
              Launch Dashboard
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>
      </section>
    </main>
  );
}
