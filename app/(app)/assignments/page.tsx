"use client";

import { useState } from "react";
import { ASSIGNMENTS } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AssignmentsPage() {
  const [done, setDone] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <PageIntro kicker="Academics" title="Assignments" description="A personal checklist. Completing a row only updates this browser session." />
      <DemoNotice />
      <div className="space-y-3">
        {ASSIGNMENTS.map((a) => (
          <article key={a.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{a.subject} · due {a.due}</p>
              <h2 className={cn("font-medium", done.includes(a.id) && "line-through text-muted-foreground")}>{a.title}</h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setDone((ids) => (ids.includes(a.id) ? ids.filter((id) => id !== a.id) : [...ids, a.id]))}
            >
              {done.includes(a.id) ? "Marked done (session)" : "Mark done"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
