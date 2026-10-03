"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Map,
  MessageCircleHeart,
  Search,
  UsersRound,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "@/components/os/BrandMark";
import { Button } from "@/components/ui/button";

const lanes = [
  {
    icon: MessageCircleHeart,
    title: "The campus conversation",
    text: "Feed, confessions, clubs, people and a kinder Lost & Found.",
    href: "/feed",
  },
  {
    icon: Map,
    title: "The campus, legible",
    text: "A visual map, facilities and student-facing services when you need them.",
    href: "/map",
  },
  {
    icon: CalendarDays,
    title: "A week with momentum",
    text: "Events, hackathons, internships and placement discovery — clearly marked demo where appropriate.",
    href: "/events",
  },
  {
    icon: Bot,
    title: "Campus-aware help",
    text: "A knowledge layer for places, events, clubs and your demo timetable.",
    href: "/campus-ai",
  },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark href="/" />
        <div className="flex items-center gap-2">
          <Button
            render={<Link href="/auth/login" />}
            nativeButton={false}
            variant="ghost"
            className="min-h-11 rounded-full px-3"
          >
            Log in
          </Button>
          <Button
            render={<Link href="/auth/signup" />}
            nativeButton={false}
            className="min-h-11 rounded-full px-3"
          >
            Get started
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-12 lg:pt-20">
        <div>
          <h1 className="max-w-3xl font-display text-[clamp(2.25rem,7.8vw,4rem)] leading-[0.94] tracking-tight lg:text-[clamp(2.5rem,4.16vw,3.75rem)]">
            ONE CAMPUS.
            <br />
            ONE IDENTITY.
            <br />
            <span className="text-primary">EVERY EXPERIENCE.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A social operating system for the moments that make a campus feel shared
            — with useful academic tools tucked in when you need them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href="/auth/signup" />}
              nativeButton={false}
              size="lg"
              className="min-h-11 rounded-full"
            >
              Create your identity
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
            <Button
              render={<Link href="/auth/login" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="min-h-11 rounded-full"
            >
              Enter CampusOS
            </Button>
          </div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55 }}
          className="glass-strong rounded-[2rem] p-4 shadow-2xl sm:p-5"
        >
          <div className="rounded-2xl border border-border bg-background/55 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Campus pulse
              </p>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Example data
              </span>
            </div>
            <p className="mt-3 font-display text-2xl">
              Something to do, someone to find, a place to be.
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
              <UsersRound className="size-5" aria-hidden="true" />
              <p className="mt-5 text-sm font-medium">Campus event example</p>
              <p className="mt-1 text-xs opacity-75">Central Quad</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <MessageCircleHeart className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-5 text-sm font-medium">A quieter place to say it</p>
              <p className="mt-1 text-xs text-muted-foreground">Anonymous confessions</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <Map className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-5 text-sm font-medium">Find Lab-4</p>
              <p className="mt-1 text-xs text-muted-foreground">Campus schematic</p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <Search className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-5 text-sm font-medium">One search, campus-wide</p>
              <p className="mt-1 text-xs text-muted-foreground">People, places, events</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mb-2 max-w-2xl">
          <p className="text-sm text-muted-foreground">
            One home for the people, places and opportunities around campus.
          </p>
        </div>
        <div className="grid gap-x-10 lg:grid-cols-2">
          {lanes.map(({ icon: Icon, title, text, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-32 items-start gap-4 border-t border-border/80 py-6 transition-colors hover:border-primary/50"
            >
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-xl font-bold text-foreground">
                    {title}
                  </span>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                  {text}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] bg-foreground px-7 py-10 text-background sm:px-10">
          <p className="text-xs uppercase tracking-[.22em] opacity-65">RBU CampusOS</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl font-display text-4xl leading-tight">
              One home for the life around your degree.
            </h2>
            <Button
              render={<Link href="/auth/signup" />}
              nativeButton={false}
              className="min-h-11 rounded-full bg-background text-foreground hover:bg-background/90"
            >
              Join your campus
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
