"use client";

import { useMemo, useState } from "react";
import { MAP_PLACES, type MapPlace } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const kinds = ["All", "Academic", "Lab", "Facility", "Service", "Social"] as const;

export default function CampusMapPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");
  const [selected, setSelected] = useState<MapPlace | null>(null);
  const places = useMemo(() => MAP_PLACES.filter((place) => (kind === "All" || place.kind === kind) && `${place.name} ${place.note}`.toLowerCase().includes(query.toLowerCase())), [kind, query]);
  return <div className="space-y-6">
    <PageIntro kicker="Campus" title="Campus Map" description="A labelled campus schematic for orientation. It is demo wayfinding, not live navigation." />
    <DemoNotice />
    <div className="flex flex-col gap-3 sm:flex-row"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search buildings and places" className="sm:max-w-xs" /><div className="flex gap-2 overflow-x-auto pb-1">{kinds.map((item) => <Button key={item} variant={kind === item ? "default" : "outline"} size="sm" className="shrink-0 rounded-full" onClick={() => setKind(item)}>{item}</Button>)}</div></div>
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="relative aspect-[10/7] min-h-[340px] overflow-hidden rounded-3xl border border-border bg-muted/35" aria-label="Campus schematic">
        <div className="absolute left-[5%] top-[48%] h-8 w-[88%] -rotate-3 rounded-full bg-border/50" /><div className="absolute left-[45%] top-[7%] h-[85%] w-8 rotate-6 rounded-full bg-border/50" />
        {MAP_PLACES.map((place) => <button key={place.id} type="button" onClick={() => setSelected(place)} className={`absolute rounded-xl border p-2 text-left text-[10px] shadow-sm transition hover:scale-[1.03] ${selected?.id === place.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/95"}`} style={{ left: `${place.x}%`, top: `${place.y}%`, width: `${place.w}%`, minHeight: `${place.h}%` }}><span className="font-semibold">{place.name}</span><span className="mt-1 block opacity-70">{place.kind}</span></button>)}
        <p className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Schematic · not to scale</p>
      </div>
      <aside className="rounded-3xl border border-border p-5"><h2 className="font-display text-xl">{selected ? selected.name : "Find a place"}</h2>{selected ? <><p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{selected.kind}</p><p className="mt-3 text-sm leading-relaxed">{selected.note}</p></> : <p className="mt-3 text-sm text-muted-foreground">Select a map label to see its campus note.</p>}<div className="mt-5 max-h-56 space-y-1 overflow-y-auto">{places.map((place) => <button key={place.id} type="button" onClick={() => setSelected(place)} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"><span>{place.name}</span><span className="ml-2 text-xs text-muted-foreground">{place.kind}</span></button>)}</div></aside>
    </div>
  </div>;
}
