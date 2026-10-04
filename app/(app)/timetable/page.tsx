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
      <div className="surface overflow-hidden rounded-3xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-meta text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Session</th>
              <th className="px-4 py-3">Room</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.day}-${row.time}-${row.title}`} className="border-t border-border">
                <td className="px-4 py-3">{row.day}</td>
                <td className="px-4 py-3 font-mono text-caption">{row.time}</td>
                <td className="px-4 py-3">
                  {row.title}
                  <span className="ml-2 text-caption text-muted-foreground">{row.kind}</span>
                </td>
                <td className="px-4 py-3">{row.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
