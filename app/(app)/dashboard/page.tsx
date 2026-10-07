"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, Check, Eye, MapPin, ShoppingBag, Users } from "lucide-react";
import { ASSIGNMENTS, ATTENDANCE, EVENTS, FEED_POSTS, TIMETABLE, STUDY_RESOURCES, MARKETPLACE_LISTINGS, MAP_PLACES } from "@/lib/campus-data";
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
        <div><p className="mb-2 text-xs text-muted-foreground">Your workspace</p><h1>{isFocusMode ? "Focus workspace." : "Mission control."}</h1><p className="mt-3 text-sm text-muted-foreground">{isFocusMode ? "Classes, tasks, and the next thing to do." : "Your classes, communities, and next moves. One connected workspace."}</p></div>
        <Button variant="outline" className="min-h-11 shrink-0 gap-2" aria-label={isFocusMode ? "Show full dashboard" : "Focus on academics"} aria-pressed={isFocusMode} onClick={() => setMode(isFocusMode ? "normal" : "focus")}><Eye className="size-4" /><span className="hidden sm:inline">{isFocusMode ? "Full dashboard" : "Focus"}</span></Button>
      </header>
      <DemoNotice />
      <SessionStorageNotice message={storageError} />
      {!isFocusMode && <div className="grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <section className="os-overview relative isolate overflow-hidden border border-border bg-card p-6 sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)", backgroundSize: "40px 40px", maskImage: "linear-gradient(110deg,transparent,black)" }} />
          <div className="relative flex items-center justify-between border-b border-border pb-4 text-xs"><span>ACADEMIC WORKSPACE</span><span className="text-muted-foreground">Sample semester</span></div>
          <div className="relative grid gap-6 py-8 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="text-sm text-muted-foreground">Your attention, organised.</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">One thing<br />at a time.</h2></div><div className="border-l-2 border-primary pl-4"><strong className="block text-6xl font-medium tracking-tighter">{pending.length.toString().padStart(2,"0")}</strong><span className="mt-2 block text-xs text-muted-foreground">tasks on your checklist</span></div></div>
          <Link href="/assignments" className="relative flex min-h-12 items-center justify-between border-t border-border pt-4 text-sm font-medium">Open your assignments <ArrowUpRight className="size-4" /></Link>
        </section>
        <nav aria-label="Campus shortcuts" className="surface p-5"><div className="dashboard-section-title"><h2>Campus connections</h2><span className="text-xs text-muted-foreground">Directory</span></div><Link href="/map" aria-label="Open the sample campus map" className="group relative mb-3 block overflow-hidden border-b border-border bg-muted/25"><svg viewBox="0 0 240 105" className="h-28 w-full text-primary" aria-hidden="true"><g transform="translate(40 -17) skewX(-25) scale(1.5 1.15)"><path d="M0 26H105M0 48H105M0 70H105M26 0V100M59 0V100" fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="1" />{MAP_PLACES.map(place => <g key={place.id}><rect x={place.x} y={place.y+3} width={place.w} height={place.h} fill="currentColor" opacity=".08" /><rect x={place.x} y={place.y} width={place.w} height={place.h} fill="var(--card)" stroke="currentColor" strokeOpacity=".5" strokeWidth=".7" /></g>)}</g></svg><span className="absolute bottom-2 right-0 flex items-center gap-1 bg-card px-2 py-1 text-xs">Sample campus topology<ArrowUpRight className="size-3" /></span></Link><div className="grid sm:grid-cols-2">{shortcuts.map(({href,title,icon:Icon}) => <Link key={href} href={href} className="dashboard-quick"><span className="flex items-center gap-3"><Icon className="size-4 text-primary" />{title}</span><ArrowUpRight className="size-4 text-muted-foreground" /></Link>)}</div></nav>
      </div>}
      <div className="os-dashboard-metrics grid grid-cols-2 border-y border-border md:grid-cols-4">
        <Link href="/attendance" className="dashboard-stat"><span>Average attendance</span><strong>{attendance}%</strong><span>{ATTENDANCE.length} courses · demo</span></Link>
        <Link href="/assignments" className="dashboard-stat"><span>On your checklist</span><strong>{pending.length.toString().padStart(2,"0")}</strong><span>{pending.length ? "Assignments remaining" : "All checked off"}</span></Link>
        <Link href="/events" className="dashboard-stat"><span>Campus happenings</span><strong>{EVENTS.length.toString().padStart(2,"0")}</strong><span>Events to explore</span></Link>
        <Link href="/notes" className="dashboard-stat"><span>The shared library</span><strong>{STUDY_RESOURCES.length.toString().padStart(2,"0")}</strong><span>Peer study resources</span></Link>
      </div>
      <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr]">
        <section className="surface p-5 sm:p-6">
          <div className="dashboard-section-title"><h2>Assignment queue</h2><Link href="/assignments">All assignments <ArrowUpRight className="ml-1 size-3" /></Link></div>
          <p className="mb-4 text-xs text-muted-foreground">Check off your work. Changes stay in this browser session.</p>
          {ASSIGNMENTS.map((a) => <label key={a.id} className="flex min-h-16 cursor-pointer items-center gap-3 border-t border-border py-3"><input type="checkbox" checked={done.includes(a.id)} onChange={() => setDone(ids => ids.includes(a.id) ? ids.filter(id => id !== a.id) : [...ids,a.id])} className="size-4 accent-[var(--primary)]" /><span className="min-w-0 flex-1"><span className={cn("block text-sm font-medium", done.includes(a.id) && "line-through text-muted-foreground")}>{a.title}</span><span className="mt-1 block text-xs text-muted-foreground">{a.subject} · {a.due}</span></span>{done.includes(a.id) && <Check className="size-4 text-primary" aria-hidden="true" />}</label>)}
        </section>
        <section className="surface p-5 sm:p-6">
          <div className="dashboard-section-title"><h2>Week at a glance</h2><Link href="/timetable">Timetable <ArrowUpRight className="ml-1 size-3" /></Link></div>
          <p className="mb-4 text-xs text-muted-foreground">From the sample timetable</p>
          {TIMETABLE.slice(0,4).map((slot,i) => <div key={i} className="flex items-start gap-4 border-t border-border py-4"><div className="min-w-12 rounded-lg bg-muted px-2 py-2 text-center text-xs font-medium">{slot.day}</div><div className="min-w-0 flex-1"><h3 className="text-sm font-medium">{slot.title}</h3><p className="mt-1 text-xs text-muted-foreground">{slot.time} · {slot.room}</p></div><span className="text-xs text-muted-foreground">{slot.kind}</span></div>)}
        </section>
      </div>
      {!isFocusMode && <>
        <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr]">
          <section><div className="dashboard-section-title"><h2>Campus dispatch</h2><Link href="/feed">Open feed <ArrowUpRight className="ml-1 size-3" /></Link></div>{FEED_POSTS.slice(0,3).map(post => <article className="dashboard-row" key={post.id}><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold">{post.author}</span><small>{post.category}</small></div><p>{post.body}</p></article>)}</section>
          <section><div className="dashboard-section-title"><h2>Events radar</h2><Link href="/events">All events <ArrowUpRight className="ml-1 size-3" /></Link></div>{EVENTS.slice(0,3).map(event => <Link key={event.id} href="/events" className="dashboard-row block"><small>{event.category} · {event.date}</small><h3 className="my-2 text-lg font-medium tracking-tight">{event.title}</h3><p className="text-muted-foreground">{event.location}</p></Link>)}</section>
        </div>
        <section className="grid gap-5 md:grid-cols-2">
          <Link href="/marketplace" className="surface flex items-start gap-4 p-6"><ShoppingBag className="mt-1 size-5 text-primary" /><div className="flex-1"><h2 className="font-medium">Campus exchange</h2><p className="mt-2 text-sm text-muted-foreground">Browse {MARKETPLACE_LISTINGS.length} sample listings for books, gear, and everyday campus essentials.</p></div><ArrowUpRight className="size-4" /></Link>
          <Link href="/campus-ai" className="surface flex items-start gap-4 p-6"><BookOpen className="mt-1 size-5 text-primary" /><div className="flex-1"><h2 className="font-medium">Campus guide</h2><p className="mt-2 text-sm text-muted-foreground">Find rooms, notes, and events with the Campus AI demo guide.</p></div><ArrowUpRight className="size-4" /></Link>
        </section>
      </>}
    </div>
  );
}
