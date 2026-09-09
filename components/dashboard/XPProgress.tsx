"use client";

import { CURRENT_STUDENT } from "@/lib/campus-data";

interface XPProgressProps {
  student: typeof CURRENT_STUDENT;
}

export default function XPProgress({ student }: XPProgressProps) {
  const xpPct = Math.round((student.xp / student.maxXp) * 100);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (xpPct / 100) * circumference;

  return (
    <div className="glass flex min-w-[260px] items-center gap-4 rounded-2xl px-4 py-3">
      <div className="relative flex size-14 items-center justify-center">
        <svg className="size-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="oklch(var(--muted))"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="oklch(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span className="absolute font-display text-lg font-bold text-foreground">
          {student.level}
        </span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Level {student.level}</span>
          <span>Rank #{student.rank}</span>
        </div>
        <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${xpPct}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {student.xp} / {student.maxXp} XP · {student.streak}-day streak
        </p>
      </div>
    </div>
  );
}