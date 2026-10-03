"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Trophy,
  Sword,
  Crown,
  Zap,
  Users,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DemoNotice } from "@/components/os/DemoNotice";
import { SessionStorageNotice } from "@/components/os/SessionStorageNotice";
import { useSessionItems } from "@/lib/session-store";

// --- TYPES ---
type GameType = "FPS" | "MOBA" | "Battle Royale" | "Strategy";

type Player = {
  rank: number;
  handle: string;
  game: string;
  type: GameType;
  score: string;
};

type Tournament = {
  id: string;
  title: string;
  game: string;
  prize: string;
  status: "Live" | "Upcoming";
  category: GameType;
};

// --- DEMO DATA ---
const DEMO_GAMING_DATA = {
  user: {
    handle: "CyberGhost_01",
    rank: "Platinum II",
    mainGame: "Valorant",
    elo: "2450",
  },
  leaderboard: [
    { rank: 1, handle: "NeonSlayer", game: "Valorant", type: "FPS" as GameType, score: "3100" },
    { rank: 2, handle: "VoidWalker", game: "LoL", type: "MOBA" as GameType, score: "2950" },
    { rank: 3, handle: "PixelKnight", game: "Starcraft II", type: "Strategy" as GameType, score: "2800" },
    { rank: 4, handle: "ApexPredator", game: "Apex Legends", type: "Battle Royale" as GameType, score: "2700" },
    { rank: 5, handle: "GlitchMaster", game: "Valorant", type: "FPS" as GameType, score: "2650" },
  ],
  tournaments: [
    { id: "t1", title: "Campus Clash: Valorant", game: "Valorant", prize: "₹10,000", status: "Live" as const, category: "FPS" as GameType },
    { id: "t2", title: "Strategist Summit", game: "Age of Empires", prize: "₹5,000", status: "Upcoming" as const, category: "Strategy" as GameType },
    { id: "t3", title: "MOBA Madness", game: "League of Legends", prize: "₹15,000", status: "Upcoming" as const, category: "MOBA" as GameType },
    { id: "t4", title: "Survival Series", game: "PUBG", prize: "₹8,000", status: "Live" as const, category: "Battle Royale" as GameType },
  ],
  achievements: [
    { name: "First Blood", icon: Sword, color: "text-red-400" },
    { name: "Tactician", icon: Zap, color: "text-blue-400" },
    { name: "Campus Legend", icon: Crown, color: "text-yellow-400" },
    { name: "Team Player", icon: Users, color: "text-green-400" },
  ]
};

// --- SUB-COMPONENTS ---

const GamerProfile = ({ user }: { user: typeof DEMO_GAMING_DATA.user }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-elevated p-6 rounded-3xl border border-primary/30 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

    <div className="relative">
      <div className="size-24 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 p-1 shadow-xl shadow-primary/20">
        <div className="size-full rounded-2xl bg-background flex items-center justify-center overflow-hidden">
           <Gamepad2 className="size-12 text-primary/40" />
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 size-8 rounded-full bg-primary border-4 border-background flex items-center justify-center text-white font-black text-[10px]">
        LVL 12
      </div>
    </div>

    <div className="flex-1 text-center md:text-left space-y-2">
      <div className="flex items-center justify-center md:justify-start gap-3">
        <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase leading-none group-hover:text-primary transition-colors">
          {user.handle}
        </h2>
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
          {user.rank}
        </span>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-4 text-muted-foreground">
        <span className="text-xs font-medium flex items-center gap-1">
          <Zap className="size-3 text-primary" /> Main: {user.mainGame}
        </span>
        <span className="text-xs font-medium flex items-center gap-1">
          <Trophy className="size-3 text-primary" /> ELO: {user.elo}
        </span>
      </div>
    </div>

    <div className="hidden lg:flex items-center gap-3">
      <div className="text-right">
        <p className="text-[10px] font-bold text-muted-foreground uppercase">Campus Rank</p>
        <p className="text-lg font-black text-foreground">#124</p>
      </div>
      <ArrowUpRight className="size-5 text-primary" />
    </div>
  </motion.div>
);

const ArenaLeaderboard = ({ players }: { players: Player[] }) => (
  <div className="glass-panel rounded-3xl border border-border/50 overflow-hidden">
    <div className="p-4 border-b border-border/50 bg-background/20 flex items-center justify-between">
      <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
        <Crown className="size-4 text-primary" /> Leaderboard Nexus
      </h2>
      <span className="text-[10px] font-bold text-muted-foreground uppercase">Demo Rankings</span>
    </div>
    <div className="divide-y divide-border/50">
      {players.map((p, i) => (
        <div key={i} className="group flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <span className={cn(
              "text-xs font-mono font-bold w-6",
              i === 0 ? "text-yellow-400" : "text-muted-foreground"
            )}>{p.rank}</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{p.handle}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{p.game} &bull; {p.type}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-black text-foreground">{p.score}</span>
            <span className="text-[9px] text-muted-foreground ml-1 uppercase">pts</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TournamentCard = ({
  tournament,
  index,
  saved,
  onToggleSaved,
}: {
  tournament: Tournament;
  index: number;
  saved: boolean;
  onToggleSaved: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="glass-panel p-5 rounded-2xl border border-border/50 group hover:border-primary/40 transition-all motion-smooth"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div className={cn(
          "size-2 rounded-full animate-pulse",
          tournament.status === "Live" ? "bg-success" : "bg-muted"
        )} />
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          {tournament.status}
        </span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
        {tournament.category}
      </span>
    </div>
    <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors mb-1 uppercase">
      {tournament.title}
    </h3>
    <p className="text-xs text-muted-foreground mb-6">Game: {tournament.game}</p>
    <div className="flex items-center justify-between pt-4 border-t border-border/50">
      <div className="flex items-center gap-1">
        <Trophy className="size-3 text-yellow-400" />
        <span className="text-xs font-bold text-foreground">{tournament.prize}</span>
      </div>
      <Button
        variant={saved ? "secondary" : "ghost"}
        size="sm"
        aria-pressed={saved}
        onClick={onToggleSaved}
        className="min-h-11 px-3 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary"
      >
        {saved ? "Saved this session" : "Save for this session"}
      </Button>
    </div>
  </motion.div>
);

export default function GamingPage() {
  const {
    items: savedTournaments,
    update: updateSavedTournaments,
    storageError,
  } =
    useSessionItems<string>("campusos.gaming.saved-tournaments", []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase opacity-80">Gaming Nexus</span>
            <div className="size-1 rounded-full bg-success animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">
            Esports <span className="text-primary italic">Arena</span>
          </h1>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Competition, Glory, and Digital Dominance
          </p>
        </div>
      </motion.div>

      <DemoNotice />
      <SessionStorageNotice message={storageError} />

      <GamerProfile user={DEMO_GAMING_DATA.user} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <ArenaLeaderboard players={DEMO_GAMING_DATA.leaderboard} />

          <div className="glass-panel p-6 rounded-3xl border border-border/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-6">
              <Trophy className="size-4 text-primary" /> Achievement Wall
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {DEMO_GAMING_DATA.achievements.map((ach, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-background/40 border border-border/50 group hover:border-primary/30 transition-all motion-fast">
                  <div className={cn("p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors", ach.color)}>
                    <ach.icon className="size-6" />
                  </div>
                  <span className="text-[10px] font-bold text-center text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tighter">
                    {ach.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Zap className="size-4 text-primary" /> Tournament examples
            </h2>
            <span className="text-[10px] font-medium text-muted-foreground">
              {DEMO_GAMING_DATA.tournaments.length} demo listings
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {DEMO_GAMING_DATA.tournaments.map((t, i) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                index={i}
                saved={savedTournaments.includes(t.id)}
                onToggleSaved={() =>
                  updateSavedTournaments((current) =>
                    current.includes(t.id)
                      ? current.filter((id) => id !== t.id)
                      : [...current, t.id]
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
