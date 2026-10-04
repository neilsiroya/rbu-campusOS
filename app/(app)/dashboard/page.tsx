"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, BookOpen, Flame } from "lucide-react";
import {
  CURRENT_STUDENT,
  CONFESSIONS,
  EVENTS,
  FEED_POSTS,
  TIMETABLE,
  DEMO_NOTICE,
  MARKETPLACE_LISTINGS,
  STUDY_RESOURCES,
} from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import CampusPulse from "@/components/dashboard/CampusPulse";
import ConfessionPreview from "@/components/dashboard/ConfessionPreview";
import QuickActions from "@/components/dashboard/QuickActions";
import AcademicPreview from "@/components/dashboard/AcademicPreview";
import XPProgress from "@/components/dashboard/XPProgress";
import CampusAIQuickAsk from "@/components/dashboard/CampusAIQuickAsk";
import CampusAIPreview from "@/components/dashboard/CampusAIPreview";

export default function DashboardPage() {
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const nextClass = TIMETABLE[2];
  const confession = CONFESSIONS[0];
  const event = EVENTS[0];

  return (
    <div className="space-y-8 stagger-in">
      {/* Hero Greeting with Telemetry */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-meta text-muted-foreground">
            Your campus environment
          </p>
          <h1 className="text-display-lg tracking-tight">
            {hello}, {CURRENT_STUDENT.name.split(" ")[0]}.
          </h1>
          <p className="text-body text-muted-foreground">
            Community first. Peer exchange. Intelligence on demand.
          </p>
        </div>
        <XPProgress student={CURRENT_STUDENT} />
      </div>

      <DemoNotice>{DEMO_NOTICE}</DemoNotice>

      {/* Main Feed & Confessions Grid */}
      <section className="grid gap-4 lg:grid-cols-12 stagger-in">
        <CampusPulse posts={FEED_POSTS} />

        <div className="flex flex-col gap-4 lg:col-span-5 stagger-in">
          <ConfessionPreview confession={confession} />

          {/* Upcoming Event Card */}
          <article className="featured-card overflow-hidden rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-meta text-muted-foreground">
                Next Marquee Event
              </p>
              <Link
                href="/events"
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                More events
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <h2 className="mt-3 text-h4 leading-tight text-foreground">
              {event.title}
            </h2>
            <p className="mt-1.5 text-caption text-muted-foreground">
              {event.date} · {event.time} · {event.location}
            </p>
          </article>
        </div>
      </section>

      {/* Marketplace & Study Hub Pulse Mini-Modules */}
      <section className="grid gap-4 lg:grid-cols-2 stagger-in">
        {/* Marketplace Pulse */}
        <div className="command-surface relative overflow-hidden rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ShoppingBag className="size-4" />
              </div>
              <div>
                <p className="text-meta text-muted-foreground">
                  Campus Marketplace
                </p>
                <p className="text-caption text-muted-foreground">
                  {MARKETPLACE_LISTINGS.length} active listings
                </p>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Browse
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 stagger-in">
            {MARKETPLACE_LISTINGS.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href="/marketplace"
                className="interactive-card rounded-2xl p-2.5"
              >
                <p className="text-caption font-semibold text-foreground group-hover:text-primary transition-colors truncate">{item.title}</p>
                <div className="mt-1 flex items-center justify-between text-caption text-muted-foreground">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">{item.type}</span>
                  {item.type === "Free" ? (
                    <span className="font-bold text-amber-600 dark:text-amber-400">Free</span>
                  ) : (
                    <span className="font-bold text-foreground">₹{item.price}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Study Hub Pulse */}
        <div className="command-surface relative overflow-hidden rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="size-4" />
              </div>
              <div>
                <p className="text-meta text-muted-foreground">
                  Study Hub Activity
                </p>
                <p className="text-caption text-muted-foreground">
                  {STUDY_RESOURCES.length} resources · {STUDY_RESOURCES.filter((s) => s.popular).length} trending
                </p>
              </div>
            </div>
            <Link
              href="/notes"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Open Hub
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 stagger-in">
            {STUDY_RESOURCES.filter((s) => s.popular)
              .slice(0, 4)
              .map((note) => (
                <Link
                  key={note.id}
                  href="/notes"
                  className="interactive-card rounded-2xl p-2.5"
                >
                  <p className="text-caption font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {note.title}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-caption text-muted-foreground">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">
                      {note.subject}
                    </span>
                    <span className="flex items-center gap-0.5 font-semibold text-primary">
                      <Flame className="size-2.5" />
                      {note.useful}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* OS Subsystem Quick Actions */}
      <QuickActions
        opportunities="3 internship examples and 2 hackathon examples."
      />

      {/* Academics & Urgency Section */}
      <AcademicPreview nextClass={nextClass} />

      {/* Campus AI Quick Ask */}
      <CampusAIQuickAsk />

      {/* Campus AI Intelligence Preview */}
      <CampusAIPreview />
    </div>
  );
}
