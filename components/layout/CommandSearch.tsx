"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
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

const SEARCH_INDEX: Hit[] = [
  ...SEARCHABLE_ROUTES.map((route) => ({
    label: route.name,
    href: route.href,
    hint: route.group,
    category: "Page" as const,
  })),
  ...MARKETPLACE_LISTINGS.map((listing) => ({
    label: listing.title,
    href: "/marketplace",
    hint: `${listing.type} · ₹${listing.price} (${listing.category})`,
    category: "Marketplace" as const,
  })),
  ...STUDY_RESOURCES.map((resource) => ({
    label: resource.title,
    href: "/notes",
    hint: `${resource.subject} · ${resource.type}`,
    category: "Study Hub" as const,
  })),
  ...EVENTS.map((event) => ({
    label: event.title,
    href: "/events",
    hint: `${event.date} · ${event.location}`,
    category: "Event" as const,
  })),
  ...CLUBS.map((club) => ({
    label: club.name,
    href: "/clubs",
    hint: club.category,
    category: "Club" as const,
  })),
  ...FACILITIES.map((facility) => ({
    label: facility.name,
    href: "/facilities",
    hint: `${facility.category} · ${facility.location}`,
    category: "Facility" as const,
  })),
  ...PEOPLE.map((person) => ({
    label: person.name,
    href: "/people",
    hint: `${person.branch} · ${person.year}`,
    category: "People" as const,
  })),
];

export default function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const hits = normalizedQuery
    ? SEARCH_INDEX.filter((hit) =>
        `${hit.label} ${hit.hint} ${hit.category}`
          .toLowerCase()
          .includes(normalizedQuery)
      ).slice(0, 12)
    : SEARCH_INDEX.filter((hit) => hit.category === "Page").slice(0, 7);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  const go = (href: string) => {
    close();
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((previous) => (hits.length ? (previous + 1) % hits.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((previous) =>
        hits.length ? (previous - 1 + hits.length) % hits.length : 0
      );
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
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setQuery("");
          setActiveIndex(0);
        }
      }}
    >
      <Dialog.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl border border-border/60 hover:bg-muted"
            aria-label="Search CampusOS (Ctrl+K)"
          >
            <Search className="size-4 text-foreground" />
          </Button>
        }
      />

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-md" />
        <Dialog.Popup className="glass-rich fixed left-1/2 top-[8vh] z-50 flex max-h-[84dvh] w-[min(92vw,40rem)] -translate-x-1/2 flex-col overflow-hidden rounded-3xl shadow-2xl">
          <Dialog.Title className="sr-only">Search CampusOS</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search campus pages and demo content. Use the arrow keys to move through
            results and Enter to open one.
          </Dialog.Description>

          <div className="flex shrink-0 items-center gap-3 border-b border-border/80 px-4 py-3">
            <Search className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <input
              autoFocus
              role="combobox"
              aria-label="Search CampusOS"
              aria-autocomplete="list"
              aria-expanded={hits.length > 0}
              aria-controls="campus-search-results"
              aria-activedescendant={
                hits.length > 0 ? `campus-search-result-${activeIndex}` : undefined
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, notes, events, clubs, facilities…"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="hidden shrink-0 rounded-lg border border-border bg-muted/60 px-2 py-1 text-[10px] font-mono text-muted-foreground sm:inline-flex">
              ESC
            </kbd>
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 rounded-xl"
                  aria-label="Close search"
                >
                  <X className="size-4" />
                </Button>
              }
            />
          </div>

          <ul
            id="campus-search-results"
            role="listbox"
            aria-label="Search results"
            className="custom-scrollbar min-h-0 space-y-1 overflow-y-auto p-2"
          >
            {hits.length === 0 ? (
              <li
                role="none"
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                No matches found for &quot;{query}&quot;. Try &quot;notes&quot;,
                &quot;events&quot;, or a page name.
              </li>
            ) : (
              hits.map((hit, index) => (
                <li role="none" key={`${hit.category}-${hit.href}-${hit.label}`}>
                  <button
                    id={`campus-search-result-${index}`}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    onClick={() => go(hit.href)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-colors",
                      activeIndex === index
                        ? "bg-primary/15 text-foreground"
                        : "text-foreground/90 hover:bg-muted/70"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn(
                          "shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-semibold",
                          getCategoryBadge(hit.category)
                        )}
                      >
                        {hit.category}
                      </span>
                      <span className="truncate text-sm font-medium">{hit.label}</span>
                    </span>
                    <span className="max-w-[40%] shrink-0 truncate pl-2 text-xs text-muted-foreground">
                      {hit.hint}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="flex shrink-0 items-center justify-between border-t border-border/80 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
            <span>↑ ↓ navigate · Enter open</span>
            <span>CampusOS Omnisearch</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
