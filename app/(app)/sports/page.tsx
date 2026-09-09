"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- TYPES ---
type MatchScore = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "Live" | "Finished";
};

type Facility = {
  id: string;
  name: string;
  type: string;
  status: "Available" | "Occupied" | "Maintenance";
  icon: React.ElementType;
};

type SportsEvent = {
  id: string;
  title: string;
  sport: string;
  time: string;
  location: string;
  type: "Trial" | "Match" | "Tournament";
};

// --- DEMO DATA ---
const DEMO_SPORTS_DATA = {
  liveScores: [
    { homeTeam: "Blue House", awayTeam: "Red House", homeScore: 2, awayScore: 1, status: "Live" as const },
    { homeTeam: "CS Dept", awayTeam: "EE Dept", homeScore: 0, awayScore: 0, status: "Live" as const },
    { homeTeam: "Mechanical", awayTeam: "Civil", homeScore: 1, awayScore: 3, status: "Finished" as const },
  ],
  facilities: [
    { id: "f1", name: "Tennis Court 1", type: "Tennis", status: "Available" as const, icon: Activity },
    { id: "f2", name: "Football Field A", type: "Football", status: "Occupied" as const, icon: Activity },
    { id: "f3", name: "Basketball Court", type: "Basketball", status: "Available" as const, icon: Activity },
    { id: "f4", name: "Gymnasium", type: "General", status: "Maintenance" as const, icon: Activity },
  ],
  events: [
    { id: "e1", title: "Inter-House Football Finals", sport: "Football", time: "Tomorrow, 09:00", location: "Main Stadium", type: "Match" as const },
    { id: "e2", title: "Athletics Selection Trials", sport: "Athletics", time: "Sept 15, 07:00", location: "Track Field", type: "Trial" as const },
    { id: "e3", title: "Badminton Open", sport: "Badminton", time: "Sept 18, 14:00", location: "Sports Hall", type: "Tournament" as const },
  ]
};

// --- SUB-COMPONENTS ---

const ScoreTicker = ({ match }: { match: MatchScore }) => (
  <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-background/40 border border-border/50 min-w-[200px] motion-fast">
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-foreground">{match.homeTeam}</span>
      <span className="text-xs font-black text-primary">{match.homeScore}</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-black text-muted-foreground">VS</span>
      {match.status === "Live" && <div className="size-1 rounded-full bg-success animate-pulse" />}
    </div>
    <div className="flex items-center gap-2 text-right">
      <span className="text-xs font-black text-primary">{match.awayScore}</span>
      <span className="text-[10px] font-bold text-foreground">{match.awayTeam}</span>
    </div>
  </div>
);

const FacilityCard = ({ facility, index }: { facility: Facility; index: number }) => {
  const statusStyles = {
    Available: "text-success bg-success/10 border-success/20",
    Occupied: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    Maintenance: "text-danger bg-danger/10 border-danger/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel p-5 rounded-2xl border border-border/50 group hover:border-primary/40 transition-all motion-smooth"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <facility.icon className="size-5" />
        </div>
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
          statusStyles[facility.status]
        )}>
          {facility.status}
        </span>
      </div>
      <h3 className="text-lg font-black text-foreground tracking-tight uppercase mb-1">
        {facility.name}
      </h3>
      <p className="text-xs text-muted-foreground mb-6">{facility.type} Facility</p>
      <Button
        disabled={facility.status !== "Available"}
        className="w-full h-9 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-105"
      >
        Book Facility
      </Button>
    </motion.div>
  );
};

const AthleticEvent = ({ event, index }: { event: SportsEvent; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/20 hover:bg-primary/5 transition-all motion-fast group"
  >
    <div className="flex items-center gap-4">
      <div className="text-xs font-mono font-bold text-muted-foreground w-24 text-right">
        {event.time}
      </div>
      <div className="relative flex items-center justify-center size-2">
        <div className="absolute size-2 rounded-full bg-border group-hover:bg-primary transition-colors" />
        <div className="absolute size-1 rounded-full bg-background" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <MapPin className="size-2.5" /> {event.location} &bull; {event.sport}
        </span>
      </div>
    </div>
    <div className={cn(
      "text-[9px] font-black uppercase px-2 py-0.5 rounded border",
      event.type === "Match" ? "border-primary/30 text-primary bg-primary/10" : "border-border text-muted-foreground bg-muted/20"
    )}>
      {event.type}
    </div>
  </motion.div>
);

export default function SportsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase opacity-80">Athletic Nexus</span>
            <div className="size-1 rounded-full bg-success animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">
            Sports <span className="text-primary italic">Hub</span>
          </h1>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            facility booking & performance telemetry
          </p>
        </div>
      </motion.div>

      {/* Live Score Ticker */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {DEMO_SPORTS_DATA.liveScores.map((match, i) => (
          <ScoreTicker key={i} match={match} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Facility Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Dumbbell className="size-4 text-primary" /> Facility Nexus
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_SPORTS_DATA.facilities.map((f, i) => (
              <FacilityCard key={f.id} facility={f} index={i} />
            ))}
          </div>
        </div>

        {/* Events Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-background/20 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Calendar className="size-4 text-primary" /> Upcoming Events
              </h2>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Scheduled</span>
            </div>
            <div className="p-6 space-y-4">
              {DEMO_SPORTS_DATA.events.map((e, i) => (
                <AthleticEvent key={e.id} event={e} index={i} />
              ))}
            </div>
          </div>

          <div className="glass-elevated p-6 rounded-2xl border border-primary/30 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Trophy className="size-4 text-primary" /> Personal Bests
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-background/40 border border-border/50">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">100m Sprint</span>
                <div className="text-lg font-black text-foreground">11.2s</div>
              </div>
              <div className="p-3 rounded-xl bg-background/40 border border-border/50">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Bench Press</span>
                <div className="text-lg font-black text-foreground">85kg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
