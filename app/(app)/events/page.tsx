"use client";

import { useMemo, useState } from "react";
import { EVENTS, SESSION_NOTICE, type CampusEvent } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";

const FILTERS: Array<"All" | CampusEvent["category"]> = [
  "All",
  "Club",
  "Cultural",
  "Technical",
  "Workshop",
  "Competition",
];

export default function EventsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selected, setSelected] = useState<CampusEvent | null>(EVENTS[0]);
  const [interested, setInterested] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const list = useMemo(
    () => (filter === "All" ? EVENTS : EVENTS.filter((e) => e.category === filter)),
    [filter]
  );

  const featured = EVENTS.find((e) => e.featured) ?? EVENTS[0];

  return (
    <div className="space-y-6">
      <PageIntro
        kicker="Community"
        title="Events"
        description="The campus week as a discovery hub — technical, cultural, club, workshop, competition."
      />
      <DemoNotice />

      <article className="overflow-hidden rounded-3xl border border-border">
        <div className="grid md:grid-cols-2">
          <div className="bg-foreground p-8 text-background">
            <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">Featured</p>
            <h2 className="mt-3 font-display text-4xl leading-tight">{featured.title}</h2>
            <p className="mt-4 text-sm leading-relaxed opacity-80">{featured.description}</p>
            <p className="mt-6 text-sm">
              {featured.date} · {featured.time} · {featured.location}
            </p>
            <Button
              className="mt-6 rounded-full bg-background text-foreground hover:bg-background/90"
              onClick={() => {
                setInterested((ids) => [...new Set([...ids, featured.id])]);
                setNote("Marked interested in this session only. No registration is sent anywhere.");
              }}
            >
              {interested.includes(featured.id) ? "Interested (this session)" : "I’m interested"}
            </Button>
          </div>
          <div className="flex flex-col justify-end bg-muted/40 p-8">
            <p className="font-display text-2xl leading-tight">Not a dashboard card. A week you can walk through.</p>
            <p className="mt-3 text-sm text-muted-foreground">{SESSION_NOTICE}</p>
          </div>
        </div>
      </article>

      {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}

      <FilterChips value={filter} onChange={setFilter} options={FILTERS} />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {list.length === 0 ? (
            <div className="sm:col-span-2">
              <EmptyState title="No events in this lane" body="Try another category." />
            </div>
          ) : (
            list.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelected(event)}
                className="rounded-2xl border border-border bg-card p-5 text-left hover:bg-muted/40"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{event.category}</p>
                <h3 className="mt-2 font-display text-xl leading-tight">{event.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {event.date} · {event.location}
                </p>
              </button>
            ))
          )}
        </div>
        {selected ? (
          <aside className="glass h-fit rounded-3xl p-5">
            <p className="text-xs text-muted-foreground">{selected.category}{selected.club ? ` · ${selected.club}` : ""}</p>
            <h3 className="mt-2 font-display text-2xl">{selected.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
            <p className="mt-4 text-sm">
              {selected.date} · {selected.time}
              <br />
              {selected.location}
            </p>
            <Button
              className="mt-5 w-full rounded-full"
              onClick={() => {
                setInterested((ids) => [...new Set([...ids, selected.id])]);
                setNote("Marked interested in this session only. No registration is sent anywhere.");
              }}
            >
              {interested.includes(selected.id) ? "Interested (this session)" : "Register interest"}
            </Button>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
