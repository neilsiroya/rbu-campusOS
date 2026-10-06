"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, Check, Eye, MapPin, ShoppingBag, Users } from "lucide-react";
import { ASSIGNMENTS, ATTENDANCE, EVENTS, FEED_POSTS, TIMETABLE, STUDY_RESOURCES, MARKETPLACE_LISTINGS } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { SessionStorageNotice } from "@/components/os/SessionStorageNotice";
import { useSessionItems } from "@/lib/session-store";
import { useOSStore } from "@/lib/os-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const shortcuts = [
  { href: "/timetable", title: "Your timetable", icon: CalendarDays },
  { href: "/notes", title: "Study resources", icon: BookOpen },
  { href: "/map", title: "Find a place", icon: MapPin },
  { href: "/clubs", title: "Find your community", icon: Users },
];
const attendance = Math.round(ATTENDANCE.reduce((sum, item) => sum + item.percent, 0) / ATTENDANCE.length);

export default function DashboardPage() {
  const { isFocusMode, setMode } = useOSStore();
  const { items: done, update: setDone, storageError } = useSessionItems<string>("campusos.assignments.saved", []);
  const pending = ASSIGNMENTS.filter((a) => !done.includes(a.id));
  return (
    <div className="space-y-7">
      <header className="dashboard-intro">
        <div><p className="mb-2 text-xs text-muted-foreground">Your workspace</p><h1>{isFocusMode ? "A little room to focus." : "Your campus, in view."}</h1><p className="mt-3 text-sm text-muted-foreground">{isFocusMode ? "Classes, tasks, and the next thing to do." : "Make space for the work. Stay close to everything else."}</p></div>
        <Button variant="outline" className="min-h-11 shrink-0 gap-2" aria-label={isFocusMode ? "Show full dashboard" : "Focus on academics"} aria-pressed={isFocusMode} onClick={() => setMode(isFocusMode ? "normal" : "focus")}><Eye className="size-4" /><span className="hidden sm:inline">{isFocusMode ? "Full dashboard" : "Focus"}</span></Button>
      </header>
      <DemoNotice />
      <SessionStorageNotice message={storageError} />
      {!isFocusMode && <div className="grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <section className="dashboard-hero">
          <Image src="/images/campus-courtyard.webp" alt="" fill sizes="(min-width: 1280px) 60vw, 100vw" priority />
          <div><p className="!mt-0 !mb-3">One campus. Every possibility.</p><h2>Life happens<br />between classes.</h2><p>Step into the conversations, communities, and places that make RBU yours.</p><Link href="/events">See what’s happening <ArrowUpRight className="size-4" /></Link></div>
        </section>
        <nav aria-label="Campus shortcuts" className="surface p-5"><div className="dashboard-section-title"><h2>Where to?</h2><span className="text-xs text-muted-foreground">CampusOS</span></div>{shortcuts.map(({href,title,icon:Icon}) => <Link key={href} href={href} className="dashboard-quick"><span className="flex items-center gap-3"><Icon className="size-4 text-primary" />{title}</span><ArrowUpRight className="size-4 text-muted-foreground" /></Link>)}</nav>
      </div>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Link href="/attendance" className="dashboard-stat"><span>Average attendance</span><strong>{attendance}%</strong><span>{ATTENDANCE.length} courses · demo</span></Link>
        <Link href="/assignments" className="dashboard-stat"><span>On your checklist</span><strong>{pending.length.toString().padStart(2,"0")}</strong><span>{pending.length ? "Assignments remaining" : "All checked off"}</span></Link>
        <Link href="/events" className="dashboard-stat"><span>Campus happenings</span><strong>{EVENTS.length.toString().padStart(2,"0")}</strong><span>Events to explore</span></Link>
        <Link href="/notes" className="dashboard-stat"><span>The shared library</span><strong>{STUDY_RESOURCES.length.toString().padStart(2,"0")}</strong><span>Peer study resources</span></Link>
      </div>
      <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr]">
        <section className="surface p-5 sm:p-6">
          <div className="dashboard-section-title"><h2>Your next small win</h2><Link href="/assignments">All assignments <ArrowUpRight className="ml-1 size-3" /></Link></div>
          <p className="mb-4 text-xs text-muted-foreground">Check off your work. Changes stay in this browser session.</p>
          {ASSIGNMENTS.map((a) => <label key={a.id} className="flex min-h-16 cursor-pointer items-center gap-3 border-t border-border py-3"><input type="checkbox" checked={done.includes(a.id)} onChange={() => setDone(ids => ids.includes(a.id) ? ids.filter(id => id !== a.id) : [...ids,a.id])} className="size-4 accent-[var(--primary)]" /><span className="min-w-0 flex-1"><span className={cn("block text-sm font-medium", done.includes(a.id) && "line-through text-muted-foreground")}>{a.title}</span><span className="mt-1 block text-xs text-muted-foreground">{a.subject} · {a.due}</span></span>{done.includes(a.id) && <Check className="size-4 text-primary" aria-hidden="true" />}</label>)}
        </section>
        <section className="surface p-5 sm:p-6">
          <div className="dashboard-section-title"><h2>A look at your week</h2><Link href="/timetable">Timetable <ArrowUpRight className="ml-1 size-3" /></Link></div>
          <p className="mb-4 text-xs text-muted-foreground">From the sample timetable</p>
          {TIMETABLE.slice(0,4).map((slot,i) => <div key={i} className="flex items-start gap-4 border-t border-border py-4"><div className="min-w-12 rounded-lg bg-muted px-2 py-2 text-center text-xs font-medium">{slot.day}</div><div className="min-w-0 flex-1"><h3 className="text-sm font-medium">{slot.title}</h3><p className="mt-1 text-xs text-muted-foreground">{slot.time} · {slot.room}</p></div><span className="text-xs text-muted-foreground">{slot.kind}</span></div>)}
        </section>
      </div>
      {!isFocusMode && <>
        <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr]">
          <section><div className="dashboard-section-title"><h2>The campus conversation</h2><Link href="/feed">Open feed <ArrowUpRight className="ml-1 size-3" /></Link></div>{FEED_POSTS.slice(0,3).map(post => <article className="dashboard-row" key={post.id}><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold">{post.author}</span><small>{post.category}</small></div><p>{post.body}</p></article>)}</section>
          <section><div className="dashboard-section-title"><h2>After class</h2><Link href="/events">All events <ArrowUpRight className="ml-1 size-3" /></Link></div>{EVENTS.slice(0,3).map(event => <Link key={event.id} href="/events" className="dashboard-row block"><small>{event.category} · {event.date}</small><h3 className="my-2 text-lg font-medium tracking-tight">{event.title}</h3><p className="text-muted-foreground">{event.location}</p></Link>)}</section>
        </div>
        <section className="grid gap-5 md:grid-cols-2">
          <Link href="/marketplace" className="surface flex items-start gap-4 p-6"><ShoppingBag className="mt-1 size-5 text-primary" /><div className="flex-1"><h2 className="font-medium">Good things, passed on.</h2><p className="mt-2 text-sm text-muted-foreground">Browse {MARKETPLACE_LISTINGS.length} sample listings for books, gear, and everyday campus essentials.</p></div><ArrowUpRight className="size-4" /></Link>
          <Link href="/campus-ai" className="surface flex items-start gap-4 p-6"><BookOpen className="mt-1 size-5 text-primary" /><div className="flex-1"><h2 className="font-medium">A little campus knowledge.</h2><p className="mt-2 text-sm text-muted-foreground">Find rooms, notes, and events with the Campus AI demo guide.</p></div><ArrowUpRight className="size-4" /></Link>
        </section>
      </>}
    </div>
  );
}
