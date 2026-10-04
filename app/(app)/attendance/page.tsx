"use client";

import { ATTENDANCE } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";

export default function AttendancePage() {
  return (
    <div className="space-y-6 stagger-in">
      <PageIntro kicker="Academics" title="Attendance" description="Self-tracking against demo session counts. CampusOS is not connected to biometric or ERP attendance." />
      <DemoNotice />
      <div className="grid gap-4 stagger-in">
        {ATTENDANCE.map((row) => (
          <article key={row.code} className="surface rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-meta text-muted-foreground">{row.code}</p>
                <h2 className="text-h4">{row.name}</h2>
              </div>
              <p className="font-display text-3xl">{row.percent}%</p>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${row.percent}%` }} />
            </div>
            <p className="mt-2 text-caption text-muted-foreground">
              {row.present} of {row.total} demo sessions
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
