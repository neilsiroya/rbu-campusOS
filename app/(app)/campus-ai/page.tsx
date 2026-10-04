"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Calendar,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  Bot,
  User,
  Send,
  Compass,
} from "lucide-react";
import {
  AI_STARTERS,
  CLUBS,
  EVENTS,
  FACILITIES,
  LOST_FOUND,
  MAP_PLACES,
  MARKETPLACE_LISTINGS,
  STUDY_RESOURCES,
  TIMETABLE,
} from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/motion";

type StructuredCard = {
  type: "place" | "event" | "marketplace" | "notes" | "service" | "timetable" | "lost-found" | "club";
  title: string;
  subtitle: string;
  meta: string;
  href: string;
  actionText: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  card?: StructuredCard;
};

function resolveCampusQuery(query: string): { text: string; card?: StructuredCard } {
  const q = query.toLowerCase();

  // 1. Lab / Building / Map query
  if (q.includes("lab-4") || q.includes("lab 4") || q.includes("robotics lab")) {
    const place = MAP_PLACES.find((p) => p.id === "lab4") || MAP_PLACES[1];
    return {
      text: `Lab-4 is located in the Computer Science Block (Ground Floor, Rear Wing). It is primarily designated for Robotics, Embedded Systems, and AI lab sessions.`,
      card: {
        type: "place",
        title: place.name,
        subtitle: place.note,
        meta: "CS Block · Ground Floor",
        href: "/map",
        actionText: "View on Campus Map",
      },
    };
  }

  if (q.includes("library") || q.includes("study slot") || q.includes("books")) {
    const lib = FACILITIES.find((f) => f.id === "f1") || FACILITIES[0];
    return {
      text: `Central Library is operational from 8:00 AM to 10:00 PM with quiet reading pods on the 2nd floor and open study halls on the 1st floor.`,
      card: {
        type: "place",
        title: lib.name,
        subtitle: lib.note,
        meta: `${lib.hours} · ${lib.location}`,
        href: "/facilities",
        actionText: "Check Facility Details",
      },
    };
  }

  // 2. Marketplace / Gear query
  if (
    q.includes("calculator") ||
    q.includes("cycle") ||
    q.includes("buy") ||
    q.includes("rent") ||
    q.includes("marketplace") ||
    q.includes("gear")
  ) {
    const item =
      MARKETPLACE_LISTINGS.find((m) =>
        q.includes("calc")
          ? m.title.toLowerCase().includes("casio")
          : q.includes("cycle")
          ? m.category === "Vehicles"
          : true
      ) || MARKETPLACE_LISTINGS[0];

    return {
      text: `Found active student listing in Campus Marketplace: ${item.title} (${item.condition}) for ₹${item.price} (${item.type}).`,
      card: {
        type: "marketplace",
        title: item.title,
        subtitle: `${item.type} · ₹${item.price} (${item.pricingUnit})`,
        meta: `Seller: ${item.seller} · ${item.location}`,
        href: "/marketplace",
        actionText: "View in Marketplace",
      },
    };
  }

  // 3. Study Hub / Notes query
  if (
    q.includes("note") ||
    q.includes("signals") ||
    q.includes("pyq") ||
    q.includes("cheat sheet") ||
    q.includes("exam")
  ) {
    const res =
      STUDY_RESOURCES.find((s) =>
        q.includes("signal")
          ? s.subject.toLowerCase().includes("signal")
          : q.includes("bee")
          ? s.subject.toLowerCase().includes("bee")
          : true
      ) || STUDY_RESOURCES[0];

    return {
      text: `Found verified study resource for ${res.subject}: "${res.title}" shared by ${res.uploader} (${res.useful} upvotes).`,
      card: {
        type: "notes",
        title: res.title,
        subtitle: `${res.subject} · ${res.type}`,
        meta: `${res.branch} ${res.year} Year · ${res.useful} useful votes`,
        href: "/notes",
        actionText: "Open in Study Hub",
      },
    };
  }

  // 4. Events query
  if (q.includes("event") || q.includes("friday") || q.includes("hackathon") || q.includes("happening")) {
    const evt = EVENTS[0];
    return {
      text: `Next marquee campus event: ${evt.title} on ${evt.date} at ${evt.time} in ${evt.location}.`,
      card: {
        type: "event",
        title: evt.title,
        subtitle: `${evt.date} at ${evt.time}`,
        meta: `${evt.location} · ${evt.category}`,
        href: "/events",
        actionText: "Open Events Calendar",
      },
    };
  }

  // 5. Shuttle / Bus / Gate query
  if (q.includes("bus") || q.includes("shuttle") || q.includes("gate") || q.includes("transport")) {
    return {
      text: `Campus Electric Shuttle operates on a continuous 15-minute loop connecting Main Gate 1, Quad, Library, and South Gate 2 from 7:30 AM to 8:30 PM.`,
      card: {
        type: "service",
        title: "Campus Electric Shuttle",
        subtitle: "Loop: Gate 1 ↔ Central Quad ↔ Gate 2",
        meta: "Frequency: Every 15 mins · Active",
        href: "/services",
        actionText: "View Campus Services",
      },
    };
  }

  // 6. Lost & Found query
  if (q.includes("lost") || q.includes("found") || q.includes("hoodie") || q.includes("item")) {
    const item = LOST_FOUND[0];
    return {
      text: `Recent entry in Lost & Found: ${item.kind} — "${item.title}" reported near ${item.location}.`,
      card: {
        type: "lost-found",
        title: item.title,
        subtitle: `${item.kind} · Reported ${item.date}`,
        meta: `Location: ${item.location} · ${item.category} · ${item.status}`,
        href: "/lost-found",
        actionText: "View Lost & Found Board",
      },
    };
  }

  // 7. Timetable / Schedule query
  if (q.includes("class") || q.includes("timetable") || q.includes("schedule") || q.includes("next")) {
    const slot = TIMETABLE[1];
    return {
      text: `Your next scheduled lecture is ${slot.title} at ${slot.time} in ${slot.room}.`,
      card: {
        type: "timetable",
        title: `${slot.title} (${slot.day})`,
        subtitle: `${slot.time} · Room ${slot.room}`,
        meta: `Kind: ${slot.kind} · Attendance: 84%`,
        href: "/timetable",
        actionText: "View Full Timetable",
      },
    };
  }

  // 8. Clubs query
  if (q.includes("club") || q.includes("community") || q.includes("society")) {
    const club = CLUBS[0];
    return {
      text: `Featured active student club: ${club.name} (${club.category}) with ${club.members} active members. Next meetup: ${club.nextEvent}.`,
      card: {
        type: "club",
        title: club.name,
        subtitle: `${club.category} · ${club.members} members`,
        meta: `Upcoming: ${club.nextEvent}`,
        href: "/clubs",
        actionText: "Explore Clubs Directory",
      },
    };
  }

  return {
    text: `I've indexed campus telemetry across buildings, study materials, marketplace listings, events, shuttle schedules, and the demo timetable. Try asking specifically about a location (e.g. "Where is Lab-4?"), study notes, or marketplace gear.`,
  };
}

export default function CampusAIPage() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-init",
      role: "assistant",
      text: "Hello! I am the CampusOS Intelligence Console. I have direct access to RBU campus places, peer study resources, marketplace gear, upcoming events, and facilities.",
      timestamp: "Now",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestIdRef = useRef<number>(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback((text: string) => {
    const q = text.trim();
    if (!q) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: q,
      timestamp: "Just now",
    };

    const resolution = resolveCampusQuery(q);
    const assistantMsg: Message = {
      id: `a-${Date.now() + 1}`,
      role: "assistant",
      text: resolution.text,
      card: resolution.card,
      timestamp: "Just now",
    };

    const id = ++latestIdRef.current;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      if (latestIdRef.current !== id) return;
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1100);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q");
    if (!query) return;

    const timeoutId = window.setTimeout(() => handleSend(query), 0);
    return () => window.clearTimeout(timeoutId);
  }, [handleSend]);

  return (
    <div className="space-y-6">
      <PageIntro
        kicker="OS Intelligence"
        title="Campus AI Console"
        description="A specialized campus knowledge companion designed to find rooms, materials, peer exchanges, and schedules instantly."
      />

      <DemoNotice>
        Campus AI operates as client-side simulated intelligence indexing demo campus data and session records with zero external API calls.
      </DemoNotice>

      {/* Main OS Chat and Quick Actions layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Chat Stream Window */}
        <section className="flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm min-h-[560px]">
          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-6 py-4 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold">RBU CampusOS Intelligence</h2>
                <p className="text-[11px] text-muted-foreground">
                  Active Knowledge Engine · Local Session
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>

          {/* Conversation history */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[88%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {msg.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-xs"
                        : "activity-surface rounded-tl-none text-foreground shadow-xs"
                    )}
                  >
                    {msg.text}
                  </div>

                  {/* Render Structured Card if attached */}
                  {msg.card && (
                    <div className="glass-rich rounded-2xl p-4 border border-border/80 shadow-md">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {msg.card.type.replace("-", " ")}
                          </span>
                          <h3 className="font-display text-base font-bold text-foreground">
                            {msg.card.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{msg.card.subtitle}</p>
                          <p className="text-[11px] text-muted-foreground/80 mt-1">{msg.card.meta}</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-border/70 flex justify-end">
                        <Link
                          href={msg.card.href}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          {msg.card.actionText}
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground px-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[88%]">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Bot className="size-4" />
                </div>
                <div className="rounded-2xl rounded-tl-none px-4 py-3.5 activity-surface shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse [animation-delay:0ms]" />
                      <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse [animation-delay:150ms]" />
                      <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse [animation-delay:300ms]" />
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Synthesizing campus knowledge…
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Box Form */}
          <div className="border-t border-border/80 p-4 bg-background/50 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Lab-4, calculator listings, Signals notes, shuttle times, or events…"
                className="h-12 rounded-2xl bg-card border-border/80 text-sm"
              />
              <MagneticButton type="submit" size="icon" className="size-12 shrink-0 rounded-2xl" strength={0.4} maxDistance={80}>
                <Send className="size-4" />
              </MagneticButton>
            </form>
          </div>
        </section>

        {/* OS Quick Actions & Starters */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              Quick Query Starters
            </h2>
            <div className="space-y-2">
              {AI_STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => handleSend(starter)}
                  className="w-full text-left rounded-2xl border border-border/70 bg-background/50 hover:bg-primary/10 hover:border-primary/40 p-3 text-xs font-medium text-foreground transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{starter}</span>
                  <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Compass className="size-3.5 text-primary" />
              Direct OS Destinations
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/marketplace"
                className="flex items-center gap-2 rounded-xl bg-muted/60 hover:bg-muted p-2.5 font-medium transition-colors"
              >
                <ShoppingBag className="size-3.5 text-amber-500" />
                Marketplace
              </Link>
              <Link
                href="/notes"
                className="flex items-center gap-2 rounded-xl bg-muted/60 hover:bg-muted p-2.5 font-medium transition-colors"
              >
                <BookOpen className="size-3.5 text-primary" />
                Study Hub
              </Link>
              <Link
                href="/map"
                className="flex items-center gap-2 rounded-xl bg-muted/60 hover:bg-muted p-2.5 font-medium transition-colors"
              >
                <MapPin className="size-3.5 text-emerald-500" />
                Campus Map
              </Link>
              <Link
                href="/events"
                className="flex items-center gap-2 rounded-xl bg-muted/60 hover:bg-muted p-2.5 font-medium transition-colors"
              >
                <Calendar className="size-3.5 text-purple-500" />
                Events
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
