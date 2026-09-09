"use client";

import { EXAMS } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <PageIntro kicker="Academics" title="Exams" description="A preparation board around a demo schedule. Not the official exam cell notice." />
      <DemoNotice />
      <div className="grid gap-4">
        {EXAMS.map((exam) => (
          <article key={exam.id} className="rounded-3xl border border-border p-6">
            <p className="text-xs text-muted-foreground">{exam.date} · {exam.slot} · {exam.room}</p>
            <h2 className="mt-2 font-display text-2xl">{exam.subject}</h2>
            <p className="mt-3 text-sm text-muted-foreground">Focus: {exam.prep}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
