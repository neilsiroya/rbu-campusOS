"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeSearch = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) {
          setOpen(false);
          triggerRef.current?.focus();
        } else {
          setOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      dialogInputRef.current?.focus();
      setActiveIndex(0);
    }, 0);
    return () => clearTimeout(id);
  }, [open]);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'input:not(:disabled), button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

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
    closeSearch(false);
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
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className="size-11 rounded-xl border border-border/60 hover:bg-muted"
        aria-label="Search CampusOS (Ctrl+K)"
        aria-expanded={open}
        aria-controls={open ? "campus-search-dialog" : undefined}
        onClick={() => setOpen(true)}
      >
        <Search className="size-4 text-foreground" />
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overscroll-contain bg-foreground/25 p-4 pt-[10vh] backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeSearch();
          }}
        >
          <div
            ref={dialogRef}
            id="campus-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="campus-search-title"
            onKeyDown={handleDialogKeyDown}
            className="glass-rich motion-reduce:animate-none w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-border/80 px-4 py-3">
              <Search className="size-5 text-primary shrink-0" />
              <h2 id="campus-search-title" className="sr-only">
                CampusOS Omnisearch
              </h2>
              <input
                ref={dialogInputRef}
                name="campus-search"
                aria-label="Search CampusOS"
                role="combobox"
                aria-controls="campus-search-results"
                aria-expanded={open}
                aria-autocomplete="list"
                aria-activedescendant={
                  hits[activeIndex] ? `campus-search-result-${activeIndex}` : undefined
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search routes, marketplace gear, notes, events, clubs, facilities…"
                className="h-9 w-full rounded-md bg-transparent text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 shrink-0"
                aria-label="Close search"
                onClick={() => closeSearch()}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <ul
              id="campus-search-results"
              role="listbox"
              aria-label="Search results"
              className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar"
            >
              {hits.length === 0 ? (
                <li role="status" aria-live="polite" className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No matches found for &quot;{query}&quot;. Try searching for &quot;calculators&quot;, &quot;notes&quot;, or &quot;events&quot;.
                </li>
              ) : (
                hits.map((hit, idx) => (
                  <li key={`${hit.category}-${hit.href}-${hit.label}-${idx}`} role="presentation">
                    <button
                      id={`campus-search-result-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={activeIndex === idx}
                      onClick={() => go(hit.href)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left transition-colors",
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
        </div>
      ) : null}
    </>
  );
}
