"use client";

import { useMemo, useState } from "react";
import { TIMETABLE } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";

const DAYS = ["All", "Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export default function TimetablePage() {
  const [day, setDay] = useState<(typeof DAYS)[number]>("All");
  const rows = useMemo(() => (day === "All" ? TIMETABLE : TIMETABLE.filter((r) => r.day === day)), [day]);

  return (
    <div className="space-y-6 stagger-in">
      <PageIntro kicker="Academics" title="Timetable" description="A personal week view. This is demo schedule data, not an official university timetable sync." />
      <DemoNotice />
      <FilterChips value={day} onChange={setDay} options={[...DAYS]} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {DAYS.filter(value => value !== "All" && (day === "All" || day === value)).map(value => {
          const sessions = rows.filter(row => row.day === value);
          return <section key={value} className="min-w-0 border-t-2 border-foreground bg-card">
            <header className="flex items-end justify-between border-b border-border px-5 py-5"><h2 className="text-3xl font-medium tracking-tight">{value}</h2><span className="text-xs text-muted-foreground">{sessions.length} sessions</span></header>
            <div className="space-y-5 p-5">{sessions.length ? sessions.map(row => <article key={`${row.day}-${row.time}-${row.title}`} className="border-l-2 border-primary pl-4"><p className="font-mono text-xs text-muted-foreground">{row.time}</p><h3 className="mt-2 text-base font-medium">{row.title}</h3><p className="mt-2 text-sm text-muted-foreground">{row.room} · {row.kind}</p></article>) : <p className="py-4 text-sm text-muted-foreground">No sample sessions scheduled.</p>}</div>
          </section>;
        })}
      </div>
    </div>
  );
}
