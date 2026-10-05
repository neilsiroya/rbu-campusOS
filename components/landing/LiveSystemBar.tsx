"use client";

import { useEffect, useState } from "react";
import { TIMETABLE, ATTENDANCE, ASSIGNMENTS } from "@/lib/campus-data";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startMinutes(time: string): number {
  const start = time.split("–")[0].split("-")[0].trim();
  const [h, m] = start.split(":").map(Number);
  return h * 60 + (m || 0);
}

function nextClass(now: Date): string {
  const dayIdx = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (let offset = 0; offset < 7; offset++) {
    const day = WEEKDAYS[(dayIdx + offset) % 7];
    const entries = TIMETABLE.filter((t) => t.day === day).sort(
      (a, b) => startMinutes(a.time) - startMinutes(b.time)
    );
    for (const e of entries) {
      if (offset === 0 && startMinutes(e.time) <= mins) continue;
      const when = offset === 0 ? `Today ${e.time}` : `${e.day} ${e.time}`;
      return `${e.title} · ${when} · ${e.room}`;
    }
  }
  return "Runway clear — no sessions scheduled";
}

/**
 * LiveSystemBar — the landing hero's proof that CampusOS is alive.
 * Real clock (Intl, 30s tick) + real demo-academic state: next class
 * from TIMETABLE, mean attendance from ATTENDANCE, nearest deadline
 * from ASSIGNMENTS. Text-only updates: safe under reduced motion.
 */
export function LiveSystemBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const meanAttendance = Math.round(
    ATTENDANCE.reduce((sum, a) => sum + a.percent, 0) / ATTENDANCE.length
  );
  const urgent = ASSIGNMENTS.find((a) => a.status === "urgent") ?? ASSIGNMENTS[0];

  const items = [
    {
      label: "System time",
      value: new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now),
    },
    { label: "Next session", value: nextClass(now) },
    { label: "Attendance", value: `${meanAttendance}% across ${ATTENDANCE.length} courses` },
    {
      label: "Due next",
      value: urgent ? `${urgent.title} · ${urgent.due}` : "Nothing due",
    },
  ];

  return (
    <div
      aria-label="Live campus status"
      className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => (
        <div key={item.label} className="bg-card/80 px-4 py-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-1 truncate text-[13px] font-semibold text-foreground" title={item.value}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
