"use client";

import { EXAMS } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";

export default function ExamsPage() {
  return (
    <div className="space-y-6 stagger-in">
      <PageIntro kicker="Academics" title="Exams" description="A preparation board around a demo schedule. Not the official exam cell notice." />
      <DemoNotice />
      <div className="grid gap-4 stagger-in">
        {EXAMS.map((exam) => (
          <article key={exam.id} className="surface rounded-3xl p-6">
            <p className="text-meta text-muted-foreground">{exam.date} · {exam.slot} · {exam.room}</p>
            <h2 className="mt-2 text-h3">{exam.subject}</h2>
            <p className="mt-3 text-body text-muted-foreground">Focus: {exam.prep}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
