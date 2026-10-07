"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


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

  // 6. Timetable query — built from the same TIMETABLE source as /timetable
  if (q.includes("timetable") || q.includes("schedule") || q.includes("class")) {
    const monday = TIMETABLE.filter((t) => t.day === "Mon");
    const summary = monday.map((t) => `${t.title} (${t.time}, ${t.room})`).join(" · ");
    return {
      text: `Here is Monday from the sample timetable: ${summary}. The full week lives in Academics.`,
      card: {
        type: "timetable",
        title: "Semester Timetable",
        subtitle: "Current semester schedule",
        meta: "Mon–Fri · see /timetable",
        href: "/timetable",
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const response = resolveCampusQuery(text.trim());
    setMessages(previous => [...previous,
      { id: crypto.randomUUID(), role: "user", text: text.trim(), timestamp },
      { id: crypto.randomUUID(), role: "assistant", text: response.text, card: response.card, timestamp }
    ]);
    setInput("");
  };
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "instant" }); }, [messages]);
  const sources = [
    { href: "/map", label: "Places", icon: MapPin, count: MAP_PLACES.length },
    { href: "/events", label: "Events", icon: Calendar, count: EVENTS.length },
    { href: "/notes", label: "Study resources", icon: BookOpen, count: STUDY_RESOURCES.length },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag, count: MARKETPLACE_LISTINGS.length },
  ];
  return <div className="space-y-6">
    <PageIntro kicker="Campus AI / local guide" title="Find your next move." description="A focused workspace for exploring the campus directory." />
    <DemoNotice>Preset answers from sample records. No AI model, live university data, or external request is involved.</DemoNotice>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
      <section aria-label="Campus guide workspace" className="flex min-w-0 flex-col border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4"><div className="flex items-center gap-3"><Compass className="size-5 text-primary" /><div><h2 className="text-sm font-semibold">Campus guide</h2><p className="text-xs text-muted-foreground">Local directory lookup</p></div></div><Button variant="ghost" size="sm" disabled={!messages.length} onClick={() => setMessages([])}>Clear session</Button></header>
        <div ref={scrollRef} role="log" aria-label="Guide conversation" aria-live="polite" className="h-[min(56dvh,560px)] min-h-72 space-y-6 overflow-y-auto p-5 sm:p-8">
          {!messages.length && <div className="flex min-h-full flex-col justify-center"><p className="text-xs text-primary">START WITH A QUESTION</p><h3 className="mt-4 max-w-md text-3xl font-medium tracking-tight sm:text-4xl">Less searching.<br />More getting there.</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Locate a room, find a resource, or explore what is happening. Choose a prompt below or type your own.</p><div className="mt-6 grid gap-2 sm:grid-cols-2">{AI_STARTERS.slice(0,4).map(starter => <button key={starter} className="flex min-h-12 items-center justify-between gap-3 border border-border p-3 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary" onClick={() => handleSend(starter)}>{starter}<ArrowRight className="size-4 shrink-0" /></button>)}</div></div>}
          {messages.map(msg => <article key={msg.id} className={cn("max-w-xl border-l-2 pl-4",msg.role === "user" ? "ml-auto border-border" : "border-primary")}><div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">{msg.role === "user" ? <User className="size-3" /> : <Bot className="size-3" />}{msg.role === "user" ? "You" : "Sample directory"}<span className="ml-auto">{msg.timestamp}</span></div><p className="text-sm leading-relaxed">{msg.text}</p>{msg.card && <Link href={msg.card.href} className="mt-4 block border border-border bg-muted/40 p-4 transition-colors hover:bg-muted"><span className="text-xs text-muted-foreground">{msg.card.type.replace("-"," ")}</span><h3 className="mt-1 text-lg font-medium tracking-tight">{msg.card.title}</h3><p className="mt-1 text-xs text-muted-foreground">{msg.card.meta}</p><span className="mt-4 flex items-center justify-between text-sm font-medium">{msg.card.actionText}<ArrowRight className="size-4" /></span></Link>}</article>)}
        </div>
        <form onSubmit={event => { event.preventDefault(); handleSend(input); }} className="border-t border-border p-4"><label htmlFor="guide-question" className="mb-2 block text-xs font-medium">Ask the campus guide</label><div className="flex gap-2"><Input id="guide-question" value={input} onChange={event => setInput(event.target.value)} placeholder="Where is Lab-4?" className="h-12 min-w-0" /><Button type="submit" aria-label="Send question" disabled={!input.trim()} className="size-12 shrink-0"><Send className="size-4" /></Button></div><p className="mt-2 text-xs text-muted-foreground">Conversation stays on this page and clears when you leave.</p></form>
      </section>
      <aside className="space-y-6"><div><h2 className="border-b border-border pb-3 text-sm font-semibold">Explore the source</h2>{sources.map(({href,label,icon:Icon,count}) => <Link key={href} href={href} className="flex min-h-14 items-center gap-3 border-b border-border py-3 text-sm hover:text-primary"><Icon className="size-4" /><span className="flex-1">{label}</span><span className="font-mono text-xs text-muted-foreground">{String(count).padStart(2,"0")}</span><ArrowRight className="size-3" /></Link>)}</div><div className="border-l-2 border-primary pl-4"><h2 className="text-sm font-medium">A useful starting point.</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This guide matches keywords to sample records. Confirm locations, times, and availability with the university before making plans.</p></div></aside>
    </div>
  </div>;
}
