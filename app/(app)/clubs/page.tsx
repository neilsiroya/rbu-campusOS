"use client";

import { useMemo, useState } from "react";
import { CLUBS, SESSION_NOTICE } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATS = ["All", ...Array.from(new Set(CLUBS.map((c) => c.category)))] as const;

export default function ClubsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [joined, setJoined] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const list = useMemo(
    () =>
      CLUBS.filter((c) => (cat === "All" || c.category === cat) && `${c.name} ${c.description}`.toLowerCase().includes(q.toLowerCase())),
    [cat, q]
  );

  return (
    <div className="space-y-6">
      <PageIntro
        kicker="Community"
        title="Clubs"
        description="Communities with rooms, rituals, and a next gathering — not a table of rows."
      />
      <DemoNotice />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clubs" className="sm:max-w-xs" />
        <FilterChips value={cat} onChange={setCat} options={[...CATS]} />
      </div>
      {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((club) => (
          <article key={club.id} className="flex flex-col rounded-3xl border border-border p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{club.category}</p>
            <h2 className="mt-2 font-display text-2xl">{club.name}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{club.description}</p>
            <p className="mt-4 text-sm">{club.members} members · {club.hall}</p>
            <p className="text-xs text-muted-foreground">{club.nextEvent}</p>
            <Button
              variant={joined.includes(club.id) ? "secondary" : "default"}
              className="mt-5 rounded-full"
              onClick={() => {
                setJoined((ids) => [...new Set([...ids, club.id])]);
                setNote(`Join request is local to this session. ${SESSION_NOTICE}`);
              }}
            >
              {joined.includes(club.id) ? "Exploring (this session)" : "Join / explore"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
