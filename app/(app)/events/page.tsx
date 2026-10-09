"use client";
import { useSessionItems } from "@/lib/session-store";
import { SessionStorageNotice } from "@/components/os/SessionStorageNotice";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EVENTS, SESSION_NOTICE, type CampusEvent } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { items: interested, update: setInterested, storageError } = useSessionItems<string>("campusos.events.saved", []);
  const [note, setNote] = useState("");

  const markInterested = (id: string) => {
    setInterested((ids) => [...new Set([...ids, id])]);
    setNote("Marked interested in this session only. No registration is sent anywhere.");
  };

  const list = useMemo(
    () => (filter === "All" ? EVENTS : EVENTS.filter((e) => e.category === filter)),
    [filter]
  );

  const featured = EVENTS.find((e) => e.featured) ?? EVENTS[0];

  return (
    <div data-controls className="space-y-6 stagger-in">
      <PageIntro
        kicker="Community"
        title="Events"
        description="Find workshops, competitions, and cultural events around campus."
      />
      <DemoNotice /><SessionStorageNotice message={storageError} />

      {filter === "All" && <section data-surface="raised" className="overflow-hidden">
        <article className="grid md:grid-cols-[1.7fr_1fr]">
          <div data-surface-density="spacious" className="bg-foreground text-background">
            <p className="text-meta opacity-70">Featured</p>
            <h2 className="mt-3 text-display-md leading-tight">{featured.title}</h2>
            <p className="mt-4 text-body leading-relaxed opacity-80">{featured.description}</p>
            <p className="mt-6 text-body">
              {featured.date} · {featured.time} · {featured.location}
            </p>
            <Button
              className="mt-6 min-h-11 rounded-full bg-background text-foreground hover:bg-background/90"
              onClick={() => markInterested(featured.id)}
            >
              {interested.includes(featured.id) ? "Interested (this session)" : "I’m interested"}
            </Button>
          </div>
          <div data-surface="inset" data-surface-density="spacious" className="flex flex-col justify-between gap-8">
            <div><p className="text-xs text-muted-foreground">ON THE PROGRAMME</p><p className="mt-4 text-6xl font-medium tracking-tighter">{String(EVENTS.length).padStart(2, "0")}</p><p className="mt-2 text-sm">Ways to take part.</p></div>
            <p className="mt-3 text-sm text-muted-foreground">{SESSION_NOTICE}</p>
          </div>
        </article>
      </section>}

      {note ? <p className="text-caption text-muted-foreground">{note}</p> : null}

      <FilterChips value={filter} onChange={setFilter} options={FILTERS} />

      <div className="surface-list">
        {list.length === 0 ? (
          <div className="sm:col-span-2">
            <EmptyState title="No events on your calendar" body="Try another category — the week is wider than one lane." />
          </div>
        ) : (
          list.map((event) => {
            const expanded = expandedId === event.id;
            const isInterested = interested.includes(event.id);
            return (
              <article
                key={event.id}
                data-surface="row"
                data-surface-density="normal"
                data-surface-interactive
                data-selected={expanded}
                className="transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : event.id)}
                  aria-expanded={expanded}
                  aria-controls={`event-panel-${event.id}`}
                  className="w-full text-left"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="text-meta text-muted-foreground">
                        {event.category}
                        {event.club ? ` · ${event.club}` : ""}
                      </span>
                      <span className="mt-2 block text-xl font-medium tracking-tight sm:text-2xl">{event.title}</span>
                      <span className="mt-2 block text-body-sm text-muted-foreground">
                        {event.date} · {event.location}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        expanded && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </button>
                {expanded ? (
                  <div
                    id={`event-panel-${event.id}`}
                    role="region"
                    className="mt-4 border-t border-border/60 pt-4"
                  >
                    <p className="text-body-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="mt-3 text-body-sm text-foreground">
                      {event.date} · {event.time}
                      <br />
                      {event.location}
                    </p>
                    <Button
                      className="mt-4 min-h-11 w-full rounded-full"
                      onClick={() => markInterested(event.id)}
                    >
                      {isInterested ? "Interested (this session)" : "Register interest"}
                    </Button>
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
