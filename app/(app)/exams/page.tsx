"use client";

import { EXAMS } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";

export default function ExamsPage() {
  return (
    <div className="space-y-6 stagger-in">
      <PageIntro kicker="Academics" title="Exams" description="A preparation board around a demo schedule. Not the official exam cell notice." />
      <DemoNotice />
      <div className="space-y-0 border-l border-border">
        {EXAMS.map((exam) => (
          <article key={exam.id} className="relative border-b border-border py-7 pl-7 before:absolute before:-left-1 before:top-9 before:size-2 before:bg-primary">
            <p className="text-meta text-muted-foreground">{exam.date} · {exam.slot} · {exam.room}</p>
            <h2 className="mt-2 text-h3">{exam.subject}</h2>
            <p className="mt-3 text-body text-muted-foreground">Focus: {exam.prep}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
