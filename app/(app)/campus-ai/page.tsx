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
import { TypingEffect } from "@/components/motion/TypingEffect";
import { CampusLiquidMetal } from "@/components/immersive/CampusLiquidMetal";

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
          : m.category === "Electronics"
      ) || MARKETPLACE_LISTINGS[0];
    return {
      text: `Found ${item.title} on the Campus Marketplace — ${item.type} for ₹${item.price}. Condition: ${item.condition}.`,
      card: {
        type: "marketplace",
        title: item.title,
        subtitle: item.description,
        meta: `${item.type} · ₹${item.price} (${item.category})`,
        href: "/marketplace",
        actionText: "View Listing",
      },
    };
  }

  // 3. Events query
  if (q.includes("event") || q.includes("hackathon") || q.includes("fest") || q.includes("workshop")) {
    const evt = EVENTS[0];
    return {
      text: `Upcoming: ${evt.title} on ${evt.date} at ${evt.location}. ${evt.description}`,
      card: {
        type: "event",
        title: evt.title,
        subtitle: evt.description,
        meta: `${evt.date} · ${evt.location}`,
        href: "/events",
        actionText: "View Event Details",
      },
    };
  }

  // 4. Notes / Study Resources query
  if (q.includes("note") || q.includes("signal") || q.includes("study") || q.includes("resource")) {
    const res = STUDY_RESOURCES.find((r) => q.includes(r.subject.toLowerCase())) || STUDY_RESOURCES[0];
    return {
      text: `Found ${res.title} (${res.subject}) — ${res.type}. Uploaded by ${res.uploader}.`,
      card: {
        type: "notes",
        title: res.title,
        subtitle: `${res.subject} · ${res.type}`,
        meta: `by ${res.uploader}`,
        href: "/notes",
        actionText: "Open Study Hub",
      },
    };
  }

  // 5. Clubs query
  if (q.includes("club") || q.includes("society") || q.includes("join")) {
    const club = CLUBS[0];
    return {
      text: `${club.name} (${club.category}) meets ${club.nextEvent} at ${club.hall}. ${club.description}`,
      card: {
        type: "club",
        title: club.name,
        subtitle: club.description,
        meta: `${club.nextEvent} · ${club.hall}`,
        href: "/clubs",
        actionText: "View Club",
      },
    };
  }

  // 6. Timetable query
  if (q.includes("timetable") || q.includes("schedule") || q.includes("class")) {
    return {
      text: `Your timetable for this semester is available in the Academics section. Here's a quick summary: Monday - Signals & Systems (9-10), Tuesday - Robotics Lab (2-5), Wednesday - Free slot for projects, Thursday - AI/ML (11-1), Friday - Embedded Systems (9-11).`,
      card: {
        type: "timetable",
        title: "Semester Timetable",
        subtitle: "Current semester schedule",
        meta: "Mon-Fri · 9AM-5PM",
        href: "/academics",
        actionText: "View Full Timetable",
      },
    };
  }

  // 7. Lost & Found query
  if (q.includes("lost") || q.includes("found") || q.includes("missing")) {
    const item = LOST_FOUND[0];
    return {
      text: `Check the Lost & Found section for ${item.title} (${item.category}) last seen at ${item.location} on ${item.date}.`,
      card: {
        type: "lost-found",
        title: item.title,
        subtitle: item.description,
        meta: `${item.location} · ${item.date}`,
        href: "/lost-found",
        actionText: "Check Lost & Found",
      },
    };
  }

  // Default fallback
  return {
    text: `I can help you with campus places, events, marketplace listings, study resources, clubs, timetables, and lost & found items. Try asking about "Lab-4 location", "calculator listings", "upcoming events", or "Signals notes".`,
  };
}

export default function CampusAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = resolveCampusQuery(text);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        card: response.card,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  return (
    <div className="min-h-screen bg-background">
      <DemoNotice>
        Ask about places, events, gear, notes, clubs, and more. This demo uses a local knowledge engine with structured cards.
      </DemoNotice>

      <PageIntro
        title="CampusOS Intelligence"
        description="Your campus-aware assistant. Ask about Lab-4, calculator listings, Signals notes, shuttle times, or events."
      />

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
          <div ref={scrollRef} className="stagger-in flex-1 space-y-4 overflow-y-auto p-6 custom-scrollbar">
            {messages.map((msg, index) => {
              const isLastAssistantMessage = index === messages.length - 1 && msg.role === "assistant";
              const shouldType = isLastAssistantMessage && !isTyping;

              return (
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
                      {shouldType ? (
                        <TypingEffect text={msg.text} speed={50} />
                      ) : (
                        msg.text
                      )}
                    </div>

                    {msg.card ? (
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
                    ) : null}

                    <p className="text-[10px] text-muted-foreground px-1">{msg.timestamp}</p>
                  </div>
                </div>
              );
            })}
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
        {/* Signature Liquid Material Core */}
        <div className="rounded-3xl border border-border/80 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", isTyping ? "bg-amber-500 animate-ping" : "bg-emerald-500 animate-pulse")} />
              {isTyping ? "Neural Reasoning Active" : "Resident Neural Surface"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">GLSL V2</span>
          </div>
          <CampusLiquidMetal
            className="h-28 w-full"
            intensity={isTyping ? 1.8 : 0.9}
            speed={isTyping ? 2.0 : 0.8}
            interactive={true}
          />
        </div>

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
            Campus Shortcuts
          </h2>
          <div className="space-y-2">
            <Link
              href="/map"
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 hover:bg-primary/10 hover:border-primary/40 p-3 transition-all"
            >
              <MapPin className="size-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Campus Map</p>
                <p className="text-[11px] text-muted-foreground">Navigate buildings, labs, facilities</p>
              </div>
            </Link>
            <Link
              href="/notes"
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 hover:bg-primary/10 hover:border-primary/40 p-3 transition-all"
            >
              <BookOpen className="size-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Study Hub</p>
                <p className="text-[11px] text-muted-foreground">Notes, resources, timetables</p>
              </div>
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 hover:bg-primary/10 hover:border-primary/40 p-3 transition-all"
            >
              <Calendar className="size-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Events & Hackathons</p>
                <p className="text-[11px] text-muted-foreground">Upcoming campus activities</p>
              </div>
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 hover:bg-primary/10 hover:border-primary/40 p-3 transition-all"
            >
              <ShoppingBag className="size-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Marketplace</p>
                <p className="text-[11px] text-muted-foreground">Buy, sell, rent campus gear</p>
              </div>
            </Link>
            <Link
              href="/clubs"
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 hover:bg-primary/10 hover:border-primary/40 p-3 transition-all"
            >
              <User className="size-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Clubs & Societies</p>
                <p className="text-[11px] text-muted-foreground">Join student communities</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  </div>
  );
}