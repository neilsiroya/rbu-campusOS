"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MAP_PLACES, type MapPlace, FACILITIES } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { PageIntro } from "@/components/os/PageIntro";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpatialCampusMap } from "@/components/map/SpatialCampusMapDynamic";
import {
  MapPin,
  Clock,
  ArrowRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const kinds = ["All", "Academic", "Lab", "Facility", "Service", "Social"] as const;

export default function CampusMapPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");
  const [selectedId, setSelectedId] = useState(MAP_PLACES[0].id);

  const places = useMemo(
    () =>
      MAP_PLACES.filter(
        (place) =>
          (kind === "All" || place.kind === kind) &&
          `${place.name} ${place.note}`.toLowerCase().includes(query.toLowerCase())
      ),
    [kind, query]
  );
  const selected: MapPlace | null = places.find((place) => place.id === selectedId) ?? places[0] ?? null;

  // Cross-reference facilities for richer context
  const matchedFacility = useMemo(() => {
    if (!selected) return null;
    return FACILITIES.find(
      (f) =>
        f.name.toLowerCase().includes(selected.name.toLowerCase()) ||
        selected.name.toLowerCase().includes(f.name.toLowerCase())
    );
  }, [selected]);

  return (
    <div className="space-y-6 stagger-in">
      <PageIntro
        kicker="Around campus"
        title="Campus Map"
        description="Find a building, explore the campus model, and check the facilities directory."
      />

      <DemoNotice>
        This is a sample campus model, not a surveyed map. Locations and opening hours are illustrative; confirm details with the university.
      </DemoNotice>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between stagger-in">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings, labs, hubs…"
            aria-label="Search campus places"
            className="pl-9 bg-background/50 rounded-xl"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {kinds.map((item) => (
            <Button
              key={item}
              variant={kind === item ? "default" : "outline"}
              size="sm"
              className="min-h-11 shrink-0 rounded-full px-4 text-xs"
              onClick={() => setKind(item)}
              aria-pressed={kind === item}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Map Viewport + Inspector Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px] stagger-in">
        {/* Interactive 3D Spatial Canvas */}
        <div className="min-w-0">
          <SpatialCampusMap
            selectedPlace={selected}
            onSelectPlace={(place) => setSelectedId(place.id)}
            places={places}
          />
        </div>

        {/* Selected Node Details Inspector */}
        <aside className="surface rounded-3xl p-6 flex flex-col justify-between border border-border/60">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {selected ? selected.kind : "Select a Zone"}
              </span>
              {selected && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  Sample location
                </span>
              )}
            </div>

            <div>
              <h2 className="font-display text-xl font-black text-foreground">
                {selected ? selected.name : "Select a Location"}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {selected ? selected.note : "Click any building in the 3D campus view or list below."}
              </p>
            </div>

            {matchedFacility && (
              <div className="rounded-2xl bg-muted/40 p-3.5 space-y-2 text-xs border border-border/40">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Clock className="size-3.5 text-primary" />
                  <span>Hours: {matchedFacility.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  <span>Wing: {matchedFacility.location}</span>
                </div>
                <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  {matchedFacility.note}
                </p>
              </div>
            )}

            {/* Quick Directory List */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Matching places ({places.length})
              </p>
              <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                {places.length === 0 && <p role="status" className="py-4 text-sm text-muted-foreground">No places match. Try another name or category.</p>}
                {places.map((place) => {
                  const isCur = selected?.id === place.id;
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => setSelectedId(place.id)}
                      aria-pressed={isCur}
                      className={cn(
                        "w-full flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all",
                        isCur
                          ? "bg-primary text-primary-foreground font-bold shadow-sm"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <span className="truncate">{place.name}</span>
                      <span
                        className={cn(
                          "ml-2 text-[10px] shrink-0",
                          isCur ? "opacity-80" : "text-muted-foreground"
                        )}
                      >
                        {place.kind}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <Button
              render={<Link href="/facilities" />}
              nativeButton={false}
              className="w-full rounded-xl gap-2 font-semibold text-xs"
            >
              Explore Campus Facilities
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
