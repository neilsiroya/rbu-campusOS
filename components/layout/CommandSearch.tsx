"use client";

import { useEffect, useRef, useState } from "react";
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
import { useOSStore } from "@/lib/os-store";
import { cn } from "@/lib/utils";

type Hit = {
  label: string;
  href: string;
  hint: string;
  category: "Page" | "Command" | "Marketplace" | "Study Hub" | "Event" | "People" | "Club" | "Facility";
  action?: () => void;
};

function makeHint(...parts: (string | number)[]): string {
  return parts.map(String).join(" - ");
}

interface CommandSearchProps {
  onOpen?: () => void;
  onClose?: () => void;
}

export default function CommandSearch({ onOpen, onClose }: CommandSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMode, triggerSpatialReset } = useOSStore();

  const COMMAND_ITEMS: Hit[] = [
    {
      label: "Enter Immersive Mode (3D Spatial Theater)",
      href: "#",
      hint: "Spatial WebGL Engine",
      category: "Command",
      action: () => setMode("immersive"),
    },
    {
      label: "Enable Focus Mode (Study Runway)",
      href: "#",
      hint: "Distraction-free",
      category: "Command",
      action: () => setMode("focus"),
    },
    {
      label: "Standard OS Mode",
      href: "#",
      hint: "Reset Mode",
      category: "Command",
      action: () => setMode("normal"),
    },
    {
      label: "Reset Spatial 3D Camera",
      href: "#",
      hint: "Campus Viewport",
      category: "Command",
      action: () => triggerSpatialReset(),
    },
  ];

  const SEARCH_INDEX: Hit[] = [
    ...COMMAND_ITEMS,
    ...SEARCHABLE_ROUTES.map((route) => ({
      label: route.name,
      href: route.href,
      hint: route.group,
      category: "Page" as const,
    })),
    ...MARKETPLACE_LISTINGS.map((listing) => ({
      label: listing.title,
      href: "/marketplace",
      hint: makeHint(listing.type, listing.price, listing.category),
      category: "Marketplace" as const,
    })),
    ...STUDY_RESOURCES.map((resource) => ({
      label: resource.title,
      href: "/notes",
      hint: makeHint(resource.subject, resource.type),
      category: "Study Hub" as const,
    })),
    ...EVENTS.map((event) => ({
      label: event.title,
      href: "/events",
      hint: makeHint(event.date, event.location),
      category: "Event" as const,
    })),
    ...FACILITIES.map((facility) => ({
      label: facility.name,
      href: "/facilities",
      hint: makeHint(facility.category, facility.location),
      category: "Facility" as const,
    })),
    ...CLUBS.map((club) => ({
      label: club.name,
      href: "/clubs",
      hint: club.category,
      category: "Club" as const,
    })),
    ...PEOPLE.map((person) => ({
      label: person.name,
      href: "/people",
      hint: makeHint(person.branch, person.year),
      category: "People" as const,
    })),
  ];

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
    : [
        ...COMMAND_ITEMS,
        ...SEARCH_INDEX.filter((hit) => hit.category === "Page").slice(0, 5),
      ];

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    onClose?.();
  };

  useEffect(() => {
    if (open) {
      onOpen?.();
    }
  }, [open, onOpen]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const executeHit = (hit: Hit) => {
    close();
    if (hit.action) {
      hit.action();
    } else {
      router.push(hit.href);
    }
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
      executeHit(hits[activeIndex]);
    }
  };

  const getCategoryBadge = (category: Hit["category"]) => {
    switch (category) {
      case "Command":
        return "bg-primary/20 text-primary border-primary/30 font-bold";
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
            aria-label="Open Omnisearch (Cmd+K)"
          >
            <Search className="size-4" />
          </Button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-md z-40 transition-opacity" />
        <Dialog.Popup className="glass-command fixed top-1/2 left-1/2 z-50 w-[min(94vw,34rem)] max-h-[82dvh] -translate-x-1/2 -translate-y-1/2 flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/95 text-foreground shadow-2xl backdrop-blur-2xl">
          <div className="flex shrink-0 items-center gap-3 border-b border-border/80 px-4 py-3 bg-muted/20">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-expanded={hits.length > 0}
              aria-controls="campus-search-results"
              aria-activedescendant={
                hits[activeIndex] ? `campus-search-result-${activeIndex}` : undefined
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command, building, note, or person…"
              className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <kbd className="rounded border border-border/80 bg-background/80 px-1.5 py-0.5">Esc</kbd>
            </div>
            <Dialog.Close
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 rounded-xl"
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
                No matches found for &quot;{query}&quot;. Try &quot;immersive&quot;,
                &quot;focus&quot;, &quot;lab-4&quot;, or &quot;notes&quot;.
              </li>
            ) : (
              hits.map((hit, index) => (
                <li role="none" key={`${hit.category}-${hit.href}-${hit.label}-${index}`}>
                  <button
                    id={`campus-search-result-${index}`}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    onClick={() => executeHit(hit)}
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
                    <span className="max-w-[40%] shrink-0 truncate pl-2 text-xs text-muted-foreground font-mono">
                      {hit.hint}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="flex shrink-0 items-center justify-between border-t border-border/80 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
            <span>Arrow keys navigate · Enter executes</span>
            <span className="font-mono text-[10px]">RBU Omnisearch</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
