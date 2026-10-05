"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Search, X, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  id: string;
  label: string;
  href: string;
  hint: string;
  category:
    | "Command"
    | "Page"
    | "Navigation"
    | "Marketplace"
    | "Study Hub"
    | "Event"
    | "People"
    | "Club"
    | "Facility";
  action?: () => void;
};

type RecentAction = {
  id: string;
  label: string;
  timestamp: number;
};

function makeHint(...parts: (string | number)[]): string {
  return parts.map(String).join(" - ");
}

const RECENT_KEY = "campusos.command.recent.v1";
const MAX_RECENT = 3;

const CATEGORY_ORDER: Hit["category"][] = [
  "Command",
  "Page",
  "Navigation",
  "Event",
  "People",
  "Club",
  "Study Hub",
  "Facility",
  "Marketplace",
];

function loadRecent(): RecentAction[] {
  try {
    const raw = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(RECENT_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentAction[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(recent: RecentAction[]): void {
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
    }
  } catch {
    /* ignore */
  }
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
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<RecentAction[]>(() => loadRecent());
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { setMode, triggerSpatialReset } = useOSStore();

  const COMMAND_ITEMS: Hit[] = useMemo(
    () => [
      {
        id: "cmd-immersive",
        label: "Enter Immersive Mode (3D Spatial Theater)",
        href: "#",
        hint: "Spatial WebGL Engine",
        category: "Command",
        action: () => setMode("immersive"),
      },
      {
        id: "cmd-focus",
        label: "Enable Focus Mode (Study Runway)",
        href: "#",
        hint: "Distraction-free",
        category: "Command",
        action: () => setMode("focus"),
      },
      {
        id: "cmd-normal",
        label: "Standard OS Mode",
        href: "#",
        hint: "Reset Mode",
        category: "Command",
        action: () => setMode("normal"),
      },
      {
        id: "cmd-reset-spatial",
        label: "Reset Spatial 3D Camera",
        href: "#",
        hint: "Campus Viewport",
        category: "Command",
        action: () => triggerSpatialReset(),
      },
    ],
    [setMode, triggerSpatialReset]
  );

  const SEARCH_INDEX: Hit[] = useMemo(() => {
    const out: Hit[] = [...COMMAND_ITEMS];
    let counter = 0;
    SEARCHABLE_ROUTES.forEach((route) => {
      out.push({
        id: `nav-${counter++}`,
        label: route.name,
        href: route.href,
        hint: route.group,
        category: "Navigation",
      });
    });
    MARKETPLACE_LISTINGS.forEach((listing) => {
      out.push({
        id: `market-${counter++}`,
        label: listing.title,
        href: "/marketplace",
        hint: makeHint(listing.type, listing.price, listing.category),
        category: "Marketplace",
      });
    });
    STUDY_RESOURCES.forEach((resource) => {
      out.push({
        id: `study-${counter++}`,
        label: resource.title,
        href: "/notes",
        hint: makeHint(resource.subject, resource.type),
        category: "Study Hub",
      });
    });
    EVENTS.forEach((event) => {
      out.push({
        id: `ev-${counter++}`,
        label: event.title,
        href: "/events",
        hint: makeHint(event.date, event.location),
        category: "Event",
      });
    });
    FACILITIES.forEach((facility) => {
      out.push({
        id: `fac-${counter++}`,
        label: facility.name,
        href: "/facilities",
        hint: makeHint(facility.category, facility.location),
        category: "Facility",
      });
    });
    CLUBS.forEach((club) => {
      out.push({
        id: `club-${counter++}`,
        label: club.name,
        href: "/clubs",
        hint: club.category,
        category: "Club",
      });
    });
    PEOPLE.forEach((person) => {
      out.push({
        id: `ppl-${counter++}`,
        label: person.name,
        href: "/people",
        hint: makeHint(person.branch, person.year),
        category: "People",
      });
    });
    return out;
  }, [COMMAND_ITEMS]);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return [];
    return SEARCH_INDEX.filter((hit) =>
      `${hit.label} ${hit.hint} ${hit.category}`.toLowerCase().includes(normalizedQuery)
    ).slice(0, 14);
  }, [normalizedQuery, SEARCH_INDEX]);

  useEffect(() => {
    if (!normalizedQuery) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = window.setTimeout(() => setLoading(false), 120);
    return () => window.clearTimeout(id);
  }, [normalizedQuery]);

  const { groupedHits, flatHits } = useMemo(() => {
    const emptyQuery = !normalizedQuery;
    const source = emptyQuery
      ? [
          ...COMMAND_ITEMS,
          ...recent
            .map((r) => SEARCH_INDEX.find((h) => h.label === r.label))
            .filter((h): h is Hit => Boolean(h))
            .slice(0, MAX_RECENT),
          ...SEARCHABLE_ROUTES.slice(0, 6).map(
            (r) =>
              ({
                id: `quick-${r.href}`,
                label: r.name,
                href: r.href,
                hint: r.group,
                category: "Navigation",
              }) as Hit
          ),
        ]
      : filtered;

    const groups = new Map<Hit["category"], Hit[]>();
    for (const hit of source) {
      if (!groups.has(hit.category)) groups.set(hit.category, []);
      groups.get(hit.category)!.push(hit);
    }

    const orderedCategories = [...groups.keys()].sort(
      (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
    );

    const grouped = orderedCategories.map((cat) => ({
      category: cat,
      items: groups.get(cat)!.slice(0, 6),
    }));

    const flat: Hit[] = [];
    for (const g of grouped) flat.push(...g.items);
    return { groupedHits: grouped, flatHits: flat };
  }, [normalizedQuery, filtered, COMMAND_ITEMS, SEARCH_INDEX, recent]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    setLoading(false);
    onClose?.();
  }, [onClose]);

  const recordRecent = useCallback((label: string) => {
    setRecent((prev) => {
      const next: RecentAction[] = [
        { id: `rec-${Date.now()}`, label, timestamp: Date.now() },
        ...prev.filter((r) => r.label !== label),
      ].slice(0, MAX_RECENT);
      saveRecent(next);
      return next;
    });
  }, []);

  const executeHit = useCallback(
    (hit: Hit) => {
      recordRecent(hit.label);
      close();
      if (hit.action) {
        hit.action();
      } else {
        router.push(hit.href);
      }
    },
    [close, recordRecent, router]
  );

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

  useEffect(() => {
    if (open) onOpen?.();
  }, [open, onOpen]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // The popup content (and input) mounts a beat after `open` flips,
      // so retry focus until the input exists. Without this, keyboard
      // users land on <body> and Cmd+K is a dead end.
      // Uses rAF for the common case plus a setTimeout fallback for
      // environments where frames are throttled (background tabs).
      let raf = 0;
      let tries = 0;
      let timer = 0;
      const focusInput = () => {
        if (inputRef.current) {
          inputRef.current.focus();
          if (document.activeElement === inputRef.current) return;
        }
        if (tries++ < 30) {
          raf = window.requestAnimationFrame(focusInput);
        } else if (!timer) {
          timer = window.setTimeout(() => {
            inputRef.current?.focus();
          }, 400);
        }
      };
      raf = window.requestAnimationFrame(focusInput);
      return () => {
        document.body.style.overflow = "";
        window.cancelAnimationFrame(raf);
        window.clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const count = flatHits.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((previous) => (count ? (previous + 1) % count : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((previous) => (count ? (previous - 1 + count) % count : 0));
    } else if (e.key === "Enter" && flatHits[activeIndex]) {
      e.preventDefault();
      executeHit(flatHits[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const getCategoryBadge = (category: Hit["category"]) => {
    switch (category) {
      case "Command":
        return "bg-primary/20 text-primary border-primary/30 font-bold";
      case "Event":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Marketplace":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Study Hub":
        return "bg-primary/10 text-primary border-primary/20";
      case "Facility":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Club":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "Navigation":
        return "bg-background border-border text-muted-foreground";
      case "People":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  let flatIdx = -1;
  const activeHit = flatHits[activeIndex];

  useEffect(() => {
    if (!open || !activeHit) return;
    const el = document.querySelector<HTMLElement>(
      `[data-cmd-id="${CSS.escape(activeHit.id)}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeHit, open]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setQuery("");
          setActiveIndex(0);
          setLoading(false);
        }
        setOpen(nextOpen);
      }}
    >
      <Dialog.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl border border-border/60 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open Omnisearch (Cmd+K)"
          >
            <Search className="size-4" />
          </Button>
        }
      />
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/60 backdrop-blur-md z-40 animate-in fade-in-0 duration-150" />
              <Dialog.Popup className="glass-command fixed top-1/2 left-1/2 z-50 w-[min(94vw,34rem)] max-h-[82dvh] -translate-x-1/2 -translate-y-1/2 flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/95 text-foreground shadow-2xl backdrop-blur-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full flex-col"
                >
                  <div className="flex shrink-0 items-center gap-3 border-b border-border/80 px-4 py-3 bg-muted/20">
                    <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                    <input
                      ref={inputRef}
                      type="search"
                      role="combobox"
                      aria-expanded={flatHits.length > 0}
                      aria-controls="campus-search-results"
                      aria-activedescendant={
                        activeHit ? `campus-search-result-${activeHit.id}` : undefined
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
                      <kbd className="rounded border border-border/80 bg-background/80 px-1.5 py-0.5">
                        Esc
                      </kbd>
                    </div>
                    <Dialog.Close
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Close search"
                        >
                          <X className="size-4" />
                        </Button>
                      }
                    />
                  </div>

                  <div
                    id="campus-search-results"
                    ref={listRef}
                    role="listbox"
                    aria-label="Search results"
                    className="custom-scrollbar min-h-0 overflow-y-auto p-2"
                  >
                    {loading && (
                      <div className="space-y-2 px-2 py-3">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="loading-preserve h-11 w-full rounded-2xl bg-muted/60"
                          />
                        ))}
                      </div>
                    )}
                    {!loading && flatHits.length === 0 ? (
                      <div
                        role="none"
                        className="px-4 py-8 text-center"
                      >
                        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                          <Sparkles className="size-4" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          Nothing found for &quot;{query}&quot;
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Try &quot;immersive&quot;, &quot;focus&quot;, &quot;lab-4&quot;, or
                          &quot;notes&quot;.
                        </p>
                      </div>
                    ) : (
                      !loading &&
                      groupedHits.map((group) => (
                        <div key={group.category} className="mt-1 first:mt-0">
                          <h3 className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5">
                            {group.category === "Command" && !normalizedQuery && recent.length > 0 ? (
                              <Clock className="size-3 opacity-70" aria-hidden="true" />
                            ) : null}
                            {group.category === "Command" && !normalizedQuery
                              ? "Commands"
                              : group.category}
                          </h3>
                          <ul className="space-y-1">
                            {group.items.map((hit) => {
                              flatIdx += 1;
                              const idx = flatIdx;
                              const isActive = idx === activeIndex;
                              return (
                                <li role="none" key={hit.id}>
                                  <button
                                    id={`campus-search-result-${hit.id}`}
                                    data-cmd-id={hit.id}
                                    type="button"
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => executeHit(hit)}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    className={cn(
                                      "flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-colors",
                                      isActive
                                        ? "bg-primary/15 text-foreground ring-1 ring-primary/20"
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
                                      <span className="truncate text-sm font-medium">
                                        {hit.label}
                                      </span>
                                    </span>
                                    <span className="max-w-[40%] shrink-0 truncate pl-2 text-xs text-muted-foreground font-mono">
                                      {hit.hint}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))
                    )}
                    {!loading && !normalizedQuery && recent.length > 0 ? (
                      <div className="mt-3 border-t border-border/60 pt-2">
                        <h3 className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5">
                          <Clock className="size-3 opacity-70" aria-hidden="true" />
                          Recent
                        </h3>
                        <ul className="space-y-1">
                          {recent.map((r) => {
                            const hit = SEARCH_INDEX.find((h) => h.label === r.label);
                            if (!hit) return null;
                            return (
                              <li role="none" key={`rec-${r.id}`}>
                                <button
                                  type="button"
                                  onClick={() => executeHit(hit)}
                                  className="flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                >
                                  <span className="text-sm">{hit.label}</span>
                                  <span className="text-[10px] font-mono text-muted-foreground/60">
                                    {hit.category}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center justify-between border-t border-border/80 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
                    <span>
                      <kbd className="rounded border border-border/70 bg-background/80 px-1.5 py-0.5 text-[9px]">
                        ↑
                      </kbd>{" "}
                      <kbd className="rounded border border-border/70 bg-background/80 px-1.5 py-0.5 text-[9px]">
                        ↓
                      </kbd>{" "}
                      navigate ·{" "}
                      <kbd className="rounded border border-border/70 bg-background/80 px-1.5 py-0.5 text-[9px]">
                        Enter
                      </kbd>{" "}
                      executes ·{" "}
                      <kbd className="rounded border border-border/70 bg-background/80 px-1.5 py-0.5 text-[9px]">
                        ⌘
                      </kbd>
                      K toggle
                    </span>
                    <span className="font-mono text-[10px]">RBU Omnisearch</span>
                  </div>
                </motion.div>
              </Dialog.Popup>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
