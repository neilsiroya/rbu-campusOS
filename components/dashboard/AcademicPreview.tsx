"use client";

import Link from "next/link";
import { Clock, ClipboardList, GraduationCap, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { TimetableEntry } from "@/lib/campus-data";

interface AcademicPreviewProps {
  nextClass: TimetableEntry;
}

export default function AcademicPreview({ nextClass }: AcademicPreviewProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Academics &amp; Urgency
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Next Class Card */}
        <div className="data-surface relative overflow-hidden rounded-3xl p-5 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Next Lecture
                </p>
                <p className="text-xs text-muted-foreground">{nextClass.time}</p>
              </div>
            </div>
            <Link href="/timetable" className="inline-flex min-h-8 items-center text-xs font-medium text-primary hover:underline">
              Full schedule
            </Link>
          </div>

          <h4 className="mt-4 font-display text-xl font-bold text-foreground">{nextClass.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {nextClass.day} · {nextClass.room}
          </p>

          <p className="mt-2 text-[11px] text-muted-foreground">
            Type: <span className="font-medium text-foreground/80">{nextClass.kind}</span>
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: "84%" }}
              />
            </div>
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">84% Att.</span>
          </div>
        </div>

        {/* Academic Urgency Tiles */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Assignment Due */}
            <div className="data-surface rounded-2xl p-4 flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <Link href="/assignments" className="inline-block py-1.5 -my-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:underline">
                  Assignment Due Soon
                </Link>
                <p className="mt-1 text-xs font-medium text-foreground">
                  OS Lab Report – Kernel Notes
                </p>
                <p className="text-[11px] text-destructive font-semibold mt-0.5">Due: 12 Sep</p>
              </div>
            </div>

            {/* Exam Prep */}
            <div className="data-surface rounded-2xl p-4 flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <GraduationCap className="size-4" />
              </div>
              <div>
                <Link href="/exams" className="inline-block py-1.5 -my-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:underline">
                  Upcoming Exam
                </Link>
                <p className="mt-1 text-xs font-medium text-foreground">
                  Signals &amp; Systems Mid-sem
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">3 weeks away</p>
              </div>
            </div>

            {/* Completed Today */}
            <div className="data-surface rounded-2xl p-4 flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Completed Today
                </p>
                <p className="mt-1 text-xs font-medium text-foreground">
                  DSA Problem Set #7 submitted
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">On time · +50 XP</p>
              </div>
            </div>

            {/* Attendance Alert */}
            <div className="data-surface rounded-2xl p-4 flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ClipboardList className="size-4" />
              </div>
              <div>
                <Link href="/attendance" className="inline-block py-1.5 -my-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:underline">
                  Attendance Status
                </Link>
                <p className="mt-1 text-xs font-medium text-foreground">
                  BEE: 74% — attend next 2 sessions
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Below 75% threshold</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
