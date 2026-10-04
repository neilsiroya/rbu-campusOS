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
import { cn } from "@/lib/utils";

// --- TYPES ---
type Course = {
  code: string;
  name: string;
  instructor: string;
  progress: number;
  nextSession: {
    time: string;
    room: string;
  };
  status: "On Track" | "Behind" | "Completed";
  credits: number;
};

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

// --- DEMO DATA ---
const DEMO_ACADEMIC_DATA = {
  stats: {
    gpa: "8.42",
    creditsEarned: "64 / 120",
    semesterRank: "14 / 180",
    attendance: "88%",
  },
  courses: [
    {
      code: "CS301",
      name: "Advanced Operating Systems",
      instructor: "Dr. Sarah Chen",
      progress: 65,
      nextSession: { time: "Tomorrow, 10:00", room: "LT-204" },
      status: "On Track" as const,
      credits: 4,
    },
    {
      code: "CS302",
      name: "Distributed Systems",
      instructor: "Prof. Marcus Thorne",
      progress: 42,
      nextSession: { time: "Wednesday, 14:00", room: "Lab-3" },
      status: "Behind" as const,
      credits: 4,
    },
    {
      code: "MA204",
      name: "Discrete Mathematics",
      instructor: "Dr. Elena Rossi",
      progress: 88,
      nextSession: { time: "Friday, 09:00", room: "LT-101" },
      status: "On Track" as const,
      credits: 3,
    },
    {
      code: "HU101",
      name: "Technical Communication",
      instructor: "Prof. Liam O'Neil",
      progress: 30,
      nextSession: { time: "Monday, 11:00", room: "Room 402" },
      status: "On Track" as const,
      credits: 2,
    },
  ],
  deadlines: [
    { subject: "OS", task: "Kernel Implementation", dueDate: "Sept 12", status: "urgent" as const },
    { subject: "DistSys", task: "Paxos Protocol Paper", dueDate: "Sept 15", status: "pending" as const },
    { subject: "Maths", task: "Graph Theory Set", dueDate: "Sept 18", status: "pending" as const },
  ],
  resources: [
    { label: " Semester Syllabus 2026", type: "Syllabus" as const, updated: "2mo ago" },
    { label: " OS Final Exam 2025", type: "PYQ" as const, updated: "1mo ago" },
    { label: " Distributed Systems L3", type: "Notes" as const, updated: "3 days ago" },
    { label: " Lab Manual - Network Sec", type: "Assignment" as const, updated: "1 week ago" },
  ]
} as const;

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
  <div className="glass-surface p-4 rounded-xl border border-border/50 flex items-center gap-4 motion-fast">
    <div className={cn("p-2 rounded-lg shadow-inner", colorClass as string)}>
      {React.createElement(Icon, { className: "size-4 text-white", "aria-hidden": "true" })}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-black text-foreground leading-none">{value}</span>
        {subValue && <span className="text-[10px] text-muted-foreground font-medium">{subValue}</span>}
      </div>
    </div>
  </div>
);

const CourseCard = ({ course, index }: { course: Course; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="glass-panel p-5 rounded-2xl border border-border/50 group hover:border-primary/40 transition-all motion-smooth relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-3">
      <span className={cn(
        "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
        course.status === "On Track" ? "border-success/30 text-success bg-success/10" : "border-danger/30 text-danger bg-danger/10"
      )}>
        {course.status}
      </span>
    </div>

    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{course.code}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{course.credits} Credits</span>
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
          {course.name}
        </h3>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Syllabus Completion</span>
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
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-3" />
          <span className="text-[10px] font-medium">{course.nextSession.time} &bull; {course.nextSession.room}</span>
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
        <span className="text-[10px] text-muted-foreground">{deadline.subject}</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono text-muted-foreground">{deadline.dueDate}</span>
      <span className={cn(
        "text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm border",
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
      <span className="text-[9px] font-bold text-muted-foreground uppercase">{resource.type}</span>
      <ChevronRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
  </motion.div>
);

export default function AcademicsPage() {
  const [courseQuery, setCourseQuery] = useState("");
  const courses = useMemo(() => {
    const query = courseQuery.trim().toLowerCase();
    return DEMO_ACADEMIC_DATA.courses.filter((course) =>
      `${course.code} ${course.name} ${course.instructor}`
        .toLowerCase()
        .includes(query)
    );
  }, [courseQuery]);

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
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase opacity-80">Academic OS</span>
            <div className="size-1 rounded-full bg-success animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">
            Academic <span className="text-primary italic">Command Center</span>
          </h1>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Semester 5 &bull; B.Tech Computer Science &bull; 2026
          </p>
        </div>

        <DemoNotice />

        <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
          <AcademicStat
            label="Current GPA"
            value={DEMO_ACADEMIC_DATA.stats.gpa}
            subValue="Top 10%"
            icon={Trophy}
            colorClass="bg-blue-500"
          />
          <AcademicStat
            label="Credits"
            value={DEMO_ACADEMIC_DATA.stats.creditsEarned}
            subValue="Earned"
            icon={GraduationCap}
            colorClass="bg-green-500"
          />
          <AcademicStat
            label="Rank"
            value={DEMO_ACADEMIC_DATA.stats.semesterRank}
            subValue="Dept."
            icon={TrendingUp}
            colorClass="bg-purple-500"
          />
          <AcademicStat
            label="Attendance"
            value={DEMO_ACADEMIC_DATA.stats.attendance}
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
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="size-4 text-primary" /> Active Course Modules
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course, i) => (
              <CourseCard key={course.code} course={course} index={i} />
            ))}
            {courses.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground md:col-span-2">
                No courses match that search.
              </p>
            ) : null}
          </div>
        </div>

        {/* Right Column: Academic Telemetry */}
        <div className="lg:col-span-4 space-y-6">

          {/* Deadlines Telemetry */}
          <div className="glass-panel rounded-2xl border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-background/20 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="size-4 text-primary" /> Pending Deadlines
              </h2>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Urgent First</span>
            </div>
            <div className="p-4 space-y-1">
              {DEMO_ACADEMIC_DATA.deadlines.map((d, i) => (
                <DeadlineRow key={i} deadline={d} index={i} />
              ))}
            </div>
          </div>

          {/* Resource Nexus */}
          <div className="glass-elevated rounded-2xl border border-border/50 overflow-hidden relative">
            <div className="p-4 border-b border-border/50 bg-background/20">
              <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <FileText className="size-4 text-primary" /> Resource Nexus
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {DEMO_ACADEMIC_DATA.resources.map((res, i) => (
                <ResourceLink key={i} resource={res} index={i} />
              ))}
            </div>
            <div className="p-4 border-t border-border/50 bg-background/10">
              <Button
                render={<Link href="/notes" />}
                nativeButton={false}
                variant="ghost"
                className="min-h-11 w-full text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary"
              >
                Browse Study Hub <ArrowUpRight className="ml-2 size-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
