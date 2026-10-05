"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  BookOpen,
  Flame,
  Sparkles,
  Layers,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Maximize2,
} from "lucide-react";
import {
  CURRENT_STUDENT,
  CONFESSIONS,
  EVENTS,
  FEED_POSTS,
  TIMETABLE,
  DEMO_NOTICE,
  MARKETPLACE_LISTINGS,
  STUDY_RESOURCES,
  ASSIGNMENTS,
  ATTENDANCE,
} from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import CampusPulse from "@/components/dashboard/CampusPulse";
import ConfessionPreview from "@/components/dashboard/ConfessionPreview";
import QuickActions from "@/components/dashboard/QuickActions";
import AcademicPreview from "@/components/dashboard/AcademicPreview";
import XPProgress from "@/components/dashboard/XPProgress";
import CampusAIQuickAsk from "@/components/dashboard/CampusAIQuickAsk";
import CampusAIPreview from "@/components/dashboard/CampusAIPreview";
import { CampusCore } from "@/components/immersive/CampusCore";
import { useOSStore } from "@/lib/os-store";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const nextClass = TIMETABLE[2];
  const confession = CONFESSIONS[0];
  const event = EVENTS[0];
  const { isFocusMode, setMode } = useOSStore();

  // If in Focus Mode, render the quiet, hyper-focused productivity runway
  if (isFocusMode) {
    return (
      <div className="space-y-6 stagger-in">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Eye className="size-4" />
            </div>
            <div>
              <h1 className="font-display text-xl font-black text-foreground">
                Focus Runway · Quiet Mode
              </h1>
              <p className="text-xs text-muted-foreground">
                Distraction-free view · Priority classes, attendance, and urgent submissions
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode("normal")}
            className="rounded-full text-xs font-semibold"
          >
            Exit Focus
          </Button>
        </div>

        {/* Focus Mode Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Priority Next Session */}
          <div className="surface rounded-3xl p-6 border border-border/70 space-y-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
              Upcoming Academic Slot
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {nextClass.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="size-3.5" />
                {nextClass.time}
              </span>
              <span>·</span>
              <span>Room {nextClass.room}</span>
              <span>·</span>
              <span>{nextClass.kind}</span>
            </div>
            <div className="pt-3 border-t border-border/40 flex justify-between items-center">
              <Link
                href="/timetable"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View Full Timetable
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Assignments Runway */}
          <div className="surface rounded-3xl p-6 border border-border/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Active Assignment Queue
              </span>
              <Link href="/assignments" className="text-xs text-primary font-semibold hover:underline">
                Open Checklist
              </Link>
            </div>
            <div className="space-y-2">
              {ASSIGNMENTS.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-2.5 text-xs">
                  <span className="font-medium text-foreground truncate max-w-[200px]">{a.title}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{a.due}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Safety Bar */}
          <div className="surface rounded-3xl p-6 border border-border/70 space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-foreground">
                Attendance Margin Status
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-500">
                Above 75% Safety Line
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {ATTENDANCE.map((att) => (
                <div key={att.code} className="rounded-2xl border border-border/40 p-3 bg-card/60">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="font-mono">{att.code}</span>
                    <span className="font-bold">{att.percent}%</span>
                  </div>
                  <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${att.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard OS Dashboard
  return (
    <div className="space-y-8 stagger-in">
      {/* Hero Greeting with Telemetry */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              RBU OS Session Active · Node 01
            </p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            {hello}, {CURRENT_STUDENT.name.split(" ")[0]}.
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Community first. Peer exchange. High-speed academic runway on demand.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-semibold gap-1.5"
            onClick={() => setMode("focus")}
          >
            <Eye className="size-3.5 text-primary" />
            Focus Mode
          </Button>

          <Button
            size="sm"
            className="rounded-full text-xs font-semibold gap-1.5 shadow-md shadow-primary/20"
            onClick={() => setMode("immersive")}
          >
            <Sparkles className="size-3.5" />
            Spatial Core 3D
          </Button>
        </div>
      </div>

      <DemoNotice>{DEMO_NOTICE}</DemoNotice>

      {/* Hero Spatial Core + Overview Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card/90 via-card/50 to-background p-6 md:p-8 shadow-xl backdrop-blur-md stagger-in">
        <div className="grid gap-6 md:grid-cols-12 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Interactive University Hub
              </span>
              <span className="text-xs text-muted-foreground">· Click Core to Ping Pulse</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              The Campus Core is actively synchronized.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Real-time awareness of lecture halls, lab bookings, upcoming deadlines, and peer exchanges. Everything is anchored in your student identity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-black text-foreground">8.42</span>
                <span className="font-mono text-xs text-muted-foreground">CGPA</span>
              </div>
              <div className="h-6 w-px bg-border/60" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-black text-emerald-500">88%</span>
                <span className="font-mono text-xs text-muted-foreground">Attendance</span>
              </div>
              <div className="h-6 w-px bg-border/60" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-black text-foreground">3</span>
                <span className="font-mono text-xs text-muted-foreground">Pending Tasks</span>
              </div>
            </div>
          </div>

          {/* Embedded 3D Campus Core canvas */}
          <div className="md:col-span-4 flex justify-center">
            <CampusCore
              size="md"
              interactive={true}
              metricLabel="Pulse Rate"
              metricValue="NORMAL"
              showTelemetry={true}
            />
          </div>
        </div>
      </section>

      {/* Main Feed & Confessions Grid */}
      <section className="grid gap-4 lg:grid-cols-12 stagger-in">
        <CampusPulse posts={FEED_POSTS} />

        <div className="flex flex-col gap-4 lg:col-span-5 stagger-in">
          <ConfessionPreview confession={confession} />

          {/* Upcoming Event Card */}
          <article className="featured-card overflow-hidden rounded-3xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Next Marquee Event
              </p>
              <Link
                href="/events"
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                More events
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <h2 className="mt-3 text-lg font-bold leading-tight text-foreground">
              {event.title}
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {event.date} · {event.time} · {event.location}
            </p>
          </article>
        </div>
      </section>

      {/* Marketplace & Study Hub Pulse Mini-Modules */}
      <section className="grid gap-4 lg:grid-cols-2 stagger-in">
        {/* Marketplace Pulse */}
        <div className="command-surface relative overflow-hidden rounded-3xl p-5 border border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ShoppingBag className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Campus Marketplace
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {MARKETPLACE_LISTINGS.length} active listings
                </p>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Browse
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 stagger-in">
            {MARKETPLACE_LISTINGS.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href="/marketplace"
                className="interactive-card rounded-2xl p-2.5"
              >
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">{item.type}</span>
                  {item.type === "Free" ? (
                    <span className="font-bold text-amber-600 dark:text-amber-400">Free</span>
                  ) : (
                    <span className="font-bold text-foreground">₹{item.price}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Study Hub Pulse */}
        <div className="command-surface relative overflow-hidden rounded-3xl p-5 border border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Study Hub Activity
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {STUDY_RESOURCES.length} resources · {STUDY_RESOURCES.filter((s) => s.popular).length} trending
                </p>
              </div>
            </div>
            <Link
              href="/notes"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Open Hub
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 stagger-in">
            {STUDY_RESOURCES.filter((s) => s.popular)
              .slice(0, 4)
              .map((note) => (
                <Link
                  key={note.id}
                  href="/notes"
                  className="interactive-card rounded-2xl p-2.5"
                >
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {note.title}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">
                      {note.subject}
                    </span>
                    <span className="flex items-center gap-0.5 font-semibold text-primary">
                      <Flame className="size-2.5" />
                      {note.useful}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* OS Subsystem Quick Actions */}
      <QuickActions opportunities="3 internship examples and 2 hackathon examples." />

      {/* Academics & Urgency Section */}
      <AcademicPreview nextClass={nextClass} />

      {/* Campus AI Quick Ask */}
      <CampusAIQuickAsk />

      {/* Campus AI Intelligence Preview */}
      <CampusAIPreview />
    </div>
  );
}
