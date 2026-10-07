"use client";

import React from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Clock,
  FileText,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Trophy,
  Search,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoNotice } from "@/components/os/DemoNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { cn } from "@/lib/utils";
import {
  COURSES,
  ACADEMIC_STATS,
  ATTENDANCE,
  ASSIGNMENTS,
  type Assignment,
  type Course,
} from "@/lib/campus-data";

// --- TYPES ---
type Resource = {
  label: string;
  type: "PYQ" | "Syllabus" | "Notes" | "Assignment";
  updated: string;
};

type Deadline = {
  subject: string;
  task: string;
  dueDate: string;
  status: "pending" | "urgent" | "completed";
};

// Attendance + deadlines derive from the single campus-data source so the
// numbers here can never drift from /attendance, /assignments, or the
// landing status bar.
const MEAN_ATTENDANCE = Math.round(
  ATTENDANCE.reduce((sum, a) => sum + a.percent, 0) / ATTENDANCE.length
);

const DEADLINES: Deadline[] = ASSIGNMENTS.map((a: Assignment) => ({
  subject: a.subject,
  task: a.title,
  dueDate: a.due,
  status: a.status,
}));

// --- DEMO DATA (local: resource-nexus links only; everything academic
// comes from lib/campus-data.ts) ---
const RESOURCES: Resource[] = [
  { label: " Semester Syllabus 2026", type: "Syllabus" as const, updated: "2mo ago" },
  { label: " OS Final Exam 2025", type: "PYQ" as const, updated: "1mo ago" },
  { label: " Distributed Systems L3", type: "Notes" as const, updated: "3 days ago" },
  { label: " Lab Manual - Network Sec", type: "Assignment" as const, updated: "1 week ago" },
];

// --- SUB-COMPONENTS ---

const AcademicStat = ({
  label,
  value,
  subValue,
  icon: Icon,
  colorClass
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  colorClass: string
}) => (
  <div className="border-l border-border py-3 pl-4 flex items-center gap-4">
    <div className={cn("p-2 rounded-lg shadow-inner", colorClass as string)}>
      {React.createElement(Icon, { className: "size-4 text-white", "aria-hidden": "true" })}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums text-foreground leading-none">{value}</span>
        {subValue && <span className="text-xs text-muted-foreground font-medium">{subValue}</span>}
      </div>
    </div>
  </div>
);

const CourseCard = ({ course, index }: { course: Course; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="surface p-5 rounded-2xl border border-border/50 group hover:border-primary/40 transition-all motion-smooth relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-3">
      <span className={cn(
        "text-xs font-semibold uppercase px-2 py-0.5 rounded-full border",
        course.status === "On Track" ? "border-success/30 text-success bg-success/10" : "border-danger/30 text-danger bg-danger/10"
      )}>
        {course.status}
      </span>
    </div>

    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{course.code}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{course.credits} Credits</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
          {course.name}
        </h3>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Syllabus Completion</span>
          <span className="text-xs font-mono font-bold text-foreground">{course.progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-label={`${course.name} syllabus completion`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={course.progress}
          className="relative h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-0 left-0 h-full bg-primary"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-3" />
          <span className="text-xs font-medium">{course.nextSession.time} &bull; {course.nextSession.room}</span>
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </div>
  </motion.div>
);

const DeadlineRow = ({ deadline, index }: { deadline: Deadline; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group flex items-center justify-between rounded-lg p-2"
  >
    <div className="flex items-center gap-3">
      <div className="size-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-foreground">{deadline.task}</span>
        <span className="text-xs text-muted-foreground">{deadline.subject}</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-muted-foreground">{deadline.dueDate}</span>
      <span className={cn(
        "text-xs font-semibold uppercase px-1.5 py-0.5 rounded-sm border",
        deadline.status === "urgent" ? "border-danger/50 text-danger bg-danger/10" : "border-border text-muted-foreground bg-muted/10"
      )}>
        {deadline.status}
      </span>
    </div>
  </motion.div>
);

const ResourceLink = ({ resource, index }: { resource: Resource; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-2"
  >
    <div className="flex items-center gap-3">
      <div className="p-1.5 rounded-md bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
        <FileText className="size-3" />
      </div>
      <span className="text-xs font-medium text-foreground">{resource.label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-muted-foreground uppercase">{resource.type}</span>
      <ChevronRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
  </motion.div>
);

export default function AcademicsPage() {
  const [courseQuery, setCourseQuery] = useState("");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const courses = useMemo(() => {
    const query = courseQuery.trim().toLowerCase();
    return COURSES.filter((course) =>
      `${course.code} ${course.name} ${course.instructor}`
        .toLowerCase()
        .includes(query)
    );
  }, [courseQuery]);

  const attendanceRows = useMemo(() => {
    const rows = [...ATTENDANCE];
    rows.sort((a, b) => (sortDir === "desc" ? b.percent - a.percent : a.percent - b.percent));
    return rows;
  }, [sortDir]);

  return (
    <div className="space-y-8">
      {/* TOP: Academic Operational Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase opacity-80">Academic workspace</span>
            <div className="size-1 rounded-full bg-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tighter text-foreground uppercase leading-none">
            Your semester.
          </h1>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Semester 5 &bull; B.Tech Computer Science &bull; 2026
          </p>
        </div>

        <DemoNotice />

        <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
          <AcademicStat
            label="Current GPA"
            value={ACADEMIC_STATS.gpa}
            subValue="Top 10%"
            icon={Trophy}
            colorClass="bg-blue-500"
          />
          <AcademicStat
            label="Credits"
            value={ACADEMIC_STATS.creditsEarned}
            subValue="Earned"
            icon={GraduationCap}
            colorClass="bg-green-500"
          />
          <AcademicStat
            label="Rank"
            value={ACADEMIC_STATS.semesterRank}
            subValue="Dept."
            icon={TrendingUp}
            colorClass="bg-amber-500"
          />
          <AcademicStat
            label="Attendance"
            value={`${MEAN_ATTENDANCE}%`}
            subValue="Overall"
            icon={Clock}
            colorClass="bg-orange-500"
          />
        </div>
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Course Control Center */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="size-4 text-primary" /> Your courses
            </h2>
            <div className="relative w-full sm:max-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
              <Input
                id="course-filter"
                type="search"
                aria-label="Filter courses"
                value={courseQuery}
                onChange={(event) => setCourseQuery(event.target.value)}
                placeholder="Filter courses..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {courses.map((course, i) => (
              <CourseCard key={course.code} course={course} index={i} />
            ))}
            {courses.length === 0 ? (
              <div className="md:col-span-2">
                <EmptyState
                  title="No courses match that search"
                  body="Try a course code like CS301 — every active module is listed here."
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Academic Telemetry */}
        <div className="lg:col-span-4 space-y-6">

          {/* Deadlines Telemetry */}
          <div className="surface rounded-2xl border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-background/20 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                <AlertCircle className="size-4 text-primary" /> Pending Deadlines
              </h2>
              <span className="text-xs font-bold text-muted-foreground uppercase">Urgent First</span>
            </div>
            <div className="p-4 space-y-1">
              {DEADLINES.map((d, i) => (
                <DeadlineRow key={i} deadline={d} index={i} />
              ))}
            </div>
          </div>

          {/* Study resources */}
          <div className="surface rounded-2xl border border-border/50 overflow-hidden relative">
            <div className="p-4 border-b border-border/50 bg-background/20">
              <h2 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                <FileText className="size-4 text-primary" /> Study resources
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {RESOURCES.map((res, i) => (
                <ResourceLink key={i} resource={res} index={i} />
              ))}
            </div>
            <div className="p-4 border-t border-border/50 bg-background/10">
              <Button
                render={<Link href="/notes" />}
                nativeButton={false}
                variant="ghost"
                className="min-h-11 w-full text-xs font-bold uppercase tracking-wide transition-all hover:bg-primary/10 hover:text-primary"
              >
                Browse Study Hub <ArrowUpRight className="ml-2 size-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Ledger — sortable on desktop, stacked cards on mobile */}
      <section aria-labelledby="attendance-ledger-heading" className="surface overflow-hidden rounded-2xl border border-border/50">
        <div className="flex items-center justify-between border-b border-border/50 bg-background/20 p-4">
          <h2 id="attendance-ledger-heading" className="text-xs font-semibold uppercase tracking-wide">
            Attendance Ledger
          </h2>
          <span className="text-xs font-bold uppercase text-muted-foreground">
            Mean {MEAN_ATTENDANCE}%
          </span>
        </div>

        <table className="hidden w-full text-left text-sm sm:table">
          <caption className="sr-only">
            Course attendance sorted by percentage
          </caption>
          <thead>
            <tr className="border-b border-border/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-bold">Course</th>
              <th scope="col" className="px-4 py-3 text-right font-bold">Attended</th>
              <th
                scope="col"
                aria-sort={sortDir === "desc" ? "descending" : "ascending"}
                className="px-4 py-3 text-right font-bold"
              >
                <button
                  type="button"
                  onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                  className="ml-auto flex min-h-8 items-center gap-1 rounded-lg px-2 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Sort by attendance percentage, currently ${sortDir === "desc" ? "highest first" : "lowest first"}`}
                >
                  Percent
                  <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span>
                </button>
              </th>
              <th scope="col" className="px-4 py-3 text-right font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRows.map((row) => (
              <tr key={row.code} className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40">
                <td className="px-4 py-3">
                  <span className="mr-2 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-bold text-primary">
                    {row.code}
                  </span>
                  <span className="text-xs font-semibold text-foreground">{row.name}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                  {row.present}/{row.total}
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center justify-end gap-2">
                    <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${row.percent}%` }} />
                    </span>
                    <span className="w-10 text-right font-mono text-xs font-bold tabular-nums text-foreground">
                      {row.percent}%
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs font-semibold uppercase",
                      row.percent >= 75
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-danger/30 bg-danger/10 text-danger"
                    )}
                  >
                    {row.percent >= 75 ? "Safe" : "At risk"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="space-y-3 p-4 sm:hidden">
          {attendanceRows.map((row) => (
            <li
              key={row.code}
              className="rounded-2xl border border-border/50 bg-background/40 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-foreground">
                  <span className="mr-2 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">
                    {row.code}
                  </span>
                  {row.name}
                </p>
                <span className="font-display text-xl font-semibold tabular-nums text-foreground">
                  {row.percent}%
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${row.percent}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-mono">
                  {row.present}/{row.total} sessions
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-xs font-semibold uppercase",
                    row.percent >= 75
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-danger/30 bg-danger/10 text-danger"
                  )}
                >
                  {row.percent >= 75 ? "Safe" : "At risk"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
