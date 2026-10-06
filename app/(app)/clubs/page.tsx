"use client";
import { useSessionItems } from "@/lib/session-store";
import { SessionStorageNotice } from "@/components/os/SessionStorageNotice";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CLUBS, EVENTS, SESSION_NOTICE } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpotlightCard } from "@/components/motion";
import { cn } from "@/lib/utils";

const CATS = ["All", ...Array.from(new Set(CLUBS.map((c) => c.category)))] as const;

export default function ClubsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const { items: joined, update: setJoined, storageError } = useSessionItems<string>("campusos.clubs.saved", []);
  const [note, setNote] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const showFeatured = cat === "All" && q.trim() === "";
  const featured = CLUBS[0];

  const list = useMemo(
    () =>
      CLUBS.filter((c) => (cat === "All" || c.category === cat) && `${c.name} ${c.description}`.toLowerCase().includes(q.toLowerCase())),
    [cat, q]
  );

  return (
    <div className="space-y-6 stagger-in">
      <PageIntro
        kicker="Community"
        title="Clubs"
        description="Communities with rooms, rituals, and a next gathering — not a table of rows."
      />
      <DemoNotice /><SessionStorageNotice message={storageError} />
      <div className="flex flex-col gap-3 sm:flex-row stagger-in">
        <Input aria-label="Search clubs" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clubs" className="sm:max-w-xs" />
        <FilterChips value={cat} onChange={setCat} options={[...CATS]} />
      </div>
      {note ? <p className="text-caption text-muted-foreground">{note}</p> : null}
      {showFeatured && featured ? (
        <SpotlightCard className="overflow-hidden rounded-3xl stagger-in" intensity={0.22}>
          <div className="grid gap-6 bg-foreground p-8 text-background md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-meta opacity-70">Largest community · {featured.category}</p>
              <h2 className="mt-3 text-display-md leading-tight">{featured.name}</h2>
              <p className="mt-4 max-w-xl text-body leading-relaxed opacity-80">
                {featured.description}
              </p>
              <p className="mt-4 text-body-sm opacity-80">
                {featured.members} members · {featured.hall} · {featured.nextEvent}
              </p>
            </div>
            <Button
              variant={joined.includes(featured.id) ? "secondary" : "default"}
              className="min-h-11 rounded-full bg-background px-6 text-foreground hover:bg-background/90"
              onClick={() => {
                setJoined((ids) => [...new Set([...ids, featured.id])]);
                setNote(`Club saved for this browser session. No join request was sent. ${SESSION_NOTICE}`);
              }}
            >
              {joined.includes(featured.id) ? "Club saved" : "Save club"}
            </Button>
          </div>
        </SpotlightCard>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 stagger-in">
        {list.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState
              title="No clubs match that search"
              body="Try a broader term — every community on the quad is listed here."
            />
          </div>
        ) : (
          list.map((club) => {
            const expanded = expandedId === club.id;
            const isJoined = joined.includes(club.id);
            const upcoming = EVENTS.filter((e) => e.club === club.name);
            return (
              <article
                key={club.id}
                className={cn(
                  "surface flex flex-col rounded-3xl p-6",
                  expanded && "border-primary/40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-meta text-muted-foreground">{club.category}</p>
                    <h2 className="mt-2 text-h3">{club.name}</h2>
                  </div>
                  {isJoined ? (
                    <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Member
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 flex-1 text-body leading-relaxed text-muted-foreground">
                  {club.description}
                </p>
                <p className="mt-4 text-body-sm">
                  {club.members} members · {club.hall}
                </p>
                <p className="text-caption text-muted-foreground">{club.nextEvent}</p>
                <div className="mt-5 flex gap-2">
                  <Button
                    variant={isJoined ? "secondary" : "default"}
                    className="min-h-11 flex-1 rounded-full"
                    onClick={() => {
                      setJoined((ids) => [...new Set([...ids, club.id])]);
                      setNote(`Club saved for this browser session. No join request was sent. ${SESSION_NOTICE}`);
                    }}
                  >
                    {isJoined ? "Club saved" : "Save club"}
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11 min-w-11 rounded-full px-4"
                    aria-expanded={expanded}
                    aria-controls={`club-panel-${club.id}`}
                    onClick={() => setExpandedId(expanded ? null : club.id)}
                  >
                    <ChevronDown
                      className={cn("size-4 transition-transform", expanded && "rotate-180")}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{expanded ? "Hide" : "Show"} upcoming activity</span>
                  </Button>
                </div>
                {expanded ? (
                  <div
                    id={`club-panel-${club.id}`}
                    role="region"
                    className="mt-4 border-t border-border/60 pt-4"
                  >
                    <p className="text-meta text-muted-foreground">Upcoming activity</p>
                    {upcoming.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {upcoming.map((e) => (
                          <li key={e.id} className="text-body-sm">
                            <span className="font-semibold text-foreground">{e.title}</span>
                            <span className="text-muted-foreground">
                              {" "}· {e.date} · {e.location}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-body-sm text-muted-foreground">
                        No scheduled events this cycle — check the events lane.
                      </p>
                    )}
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
