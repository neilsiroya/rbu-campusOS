"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CLUBS,
  EVENTS,
  PEOPLE,
  MARKETPLACE_LISTINGS,
  STUDY_RESOURCES,
  FACILITIES,
} from "@/lib/campus-data";
import { SEARCHABLE_ROUTES } from "@/lib/nav";
import { cn } from "@/lib/utils";

type Hit = {
  label: string;
  href: string;
  hint: string;
  category: "Page" | "Marketplace" | "Study Hub" | "Event" | "People" | "Club" | "Facility";
};

export default function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      dialogInputRef.current?.focus();
      setActiveIndex(0);
    }, 0);
    return () => clearTimeout(id);
  }, [open]);

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();

    const routes: Hit[] = SEARCHABLE_ROUTES.map((r) => ({
      label: r.name,
      href: r.href,
      hint: r.group,
      category: "Page",
    }));

    const marketplace: Hit[] = MARKETPLACE_LISTINGS.map((m) => ({
      label: m.title,
      href: "/marketplace",
      hint: `${m.type} · ₹${m.price} (${m.category})`,
      category: "Marketplace",
    }));

    const study: Hit[] = STUDY_RESOURCES.map((s) => ({
      label: s.title,
      href: "/notes",
      hint: `${s.subject} · ${s.type}`,
      category: "Study Hub",
    }));

    const people: Hit[] = PEOPLE.map((p) => ({
      label: p.name,
      href: "/people",
      hint: `${p.branch} · ${p.year}`,
      category: "People",
    }));

    const events: Hit[] = EVENTS.map((e) => ({
      label: e.title,
      href: "/events",
      hint: `${e.date} · ${e.location}`,
      category: "Event",
    }));

    const clubs: Hit[] = CLUBS.map((c) => ({
      label: c.name,
      href: "/clubs",
      hint: c.category,
      category: "Club",
    }));

    const facilities: Hit[] = FACILITIES.map((f) => ({
      label: f.name,
      href: "/facilities",
      hint: `${f.category} · ${f.location}`,
      category: "Facility",
    }));

    const all = [...routes, ...marketplace, ...study, ...events, ...clubs, ...facilities, ...people];

    if (!q) return routes.slice(0, 7);

    return all
      .filter((h) => `${h.label} ${h.hint} ${h.category}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % (hits.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + hits.length) % (hits.length || 1));
    } else if (e.key === "Enter" && hits[activeIndex]) {
      e.preventDefault();
      go(hits[activeIndex].href);
    }
  };

  const getCategoryBadge = (category: Hit["category"]) => {
    switch (category) {
      case "Marketplace":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Study Hub":
        return "bg-primary/10 text-primary border-primary/20";
      case "Event":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Facility":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Club":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-xl border border-border/60 hover:bg-muted"
        aria-label="Search CampusOS (Ctrl+K)"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4 text-foreground" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/25 p-4 pt-[10vh] backdrop-blur-md">
          <div
            role="dialog"
            aria-label="CampusOS Omnisearch"
            className="glass-rich w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-border/80 px-4 py-3">
              <Search className="size-5 text-primary shrink-0" />
              <input
                ref={dialogInputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search routes, marketplace gear, notes, events, clubs, facilities…"
                className="h-9 w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
                autoComplete="off"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <ul className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {hits.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No matches found for &quot;{query}&quot;. Try searching for &quot;calculators&quot;, &quot;notes&quot;, or &quot;events&quot;.
                </li>
              ) : (
                hits.map((hit, idx) => (
                  <li key={`${hit.category}-${hit.href}-${hit.label}-${idx}`}>
                    <button
                      type="button"
                      onClick={() => go(hit.href)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left transition-colors",
                        activeIndex === idx
                          ? "bg-primary/15 text-foreground"
                          : "hover:bg-muted/70 text-foreground/90"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={cn(
                            "rounded-lg border px-2 py-0.5 text-[10px] font-semibold shrink-0",
                            getCategoryBadge(hit.category)
                          )}
                        >
                          {hit.category}
                        </span>
                        <span className="text-sm font-medium truncate">{hit.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate pl-3 max-w-[200px]">
                        {hit.hint}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Omnisearch Footer */}
            <div className="flex items-center justify-between border-t border-border/80 px-4 py-2.5 text-[11px] text-muted-foreground bg-muted/20">
              <span>Use ↑ ↓ to navigate, ↵ to select</span>
              <span>RBU CampusOS Omnisearch</span>
            </div>
          </div>
          <button
            type="button"
            className="absolute inset-0 -z-10 cursor-default"
            aria-label="Close search modal"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </>
  );
}
