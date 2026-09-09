"use client";

import { ATTENDANCE } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageIntro kicker="Academics" title="Attendance" description="Self-tracking against demo session counts. CampusOS is not connected to biometric or ERP attendance." />
      <DemoNotice />
      <div className="grid gap-4">
        {ATTENDANCE.map((row) => (
          <article key={row.code} className="rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{row.code}</p>
                <h2 className="font-display text-xl">{row.name}</h2>
              </div>
              <p className="font-display text-3xl">{row.percent}%</p>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-foreground" style={{ width: `${row.percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {row.present} of {row.total} demo sessions
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
