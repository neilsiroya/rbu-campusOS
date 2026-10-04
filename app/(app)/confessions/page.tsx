"use client";

import { useMemo, useState } from "react";
import {
  Flame,
  Plus,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import {
  ALIASES,
  CONFESSIONS,
  SESSION_NOTICE,
  type Confession,
  type ConfessionCategory,
} from "@/lib/campus-data";
import { useSessionItems } from "@/lib/session-store";
import { useToast } from "@/lib/toast-context";
import { DemoNotice } from "@/components/os/DemoNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const categories: Array<"All" | ConfessionCategory> = [
  "All",
  "Campus",
  "Academics",
  "Hostel",
  "Canteen",
  "Unsent",
  "Wholesome",
];

export default function ConfessionsPage() {
  const { items, prepend, update } = useSessionItems<Confession>(
    "campusos.confessions",
    CONFESSIONS
  );
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [body, setBody] = useState("");
  const [alias, setAlias] = useState(ALIASES[0]);
  const [open, setOpen] = useState(false);

  const list = useMemo(
    () =>
      items.filter(
        (c) =>
          (category === "All" || c.category === category) &&
          c.body.toLowerCase().includes(query.toLowerCase())
      ),
    [items, category, query]
  );

  const respond = (id: string) => {
    const text = window.prompt("Reply anonymously (session only):");
    if (!text?.trim()) return;
    update((all) =>
      all.map((c) =>
        c.id === id
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: crypto.randomUUID(),
                  alias: "Quiet Bench",
                  body: text.trim(),
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : c
      )
    );
  };

  const submitConfession = () => {
    if (!body.trim()) return;
    prepend({
      id: crypto.randomUUID(),
      alias,
      category: category === "All" ? "Campus" : category,
      body: body.trim(),
      createdAt: new Date().toISOString(),
      reactions: { relate: 0, hug: 0, wild: 0 },
      replies: [],
      sessionLocal: true,
    });
    setBody("");
    setOpen(false);
    toast("Whispered anonymously to the campus.", "success");
  };

  return (
    <div className="space-y-6">
      <PageIntro
        kicker="Community"
        title="Confessions"
        description="A deliberately anonymous board. No identity, email, or profile is shown in a confession."
      />

      <DemoNotice />

      {/* Composer + Filters */}
      <div className="flex flex-col gap-3">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            render={
              <Button className="self-start rounded-full gap-1.5">
                <Plus className="size-4" />
                Whisper Confession
              </Button>
            }
          />
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Popup className="glass-strong fixed top-1/2 left-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 rounded-3xl p-6 text-foreground shadow-2xl">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Flame className="size-4" />
                </div>
                <div>
                  <Dialog.Title className="font-display text-base font-bold">
                    Whisper an Anonymous Confession
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-muted-foreground">
                    No IP addresses, names, or roll numbers are linked.
                  </Dialog.Description>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitConfession();
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Choose Anonymous Alias
                  </label>
                  <select
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border/80 bg-background px-3 text-sm focus:outline-none"
                  >
                    {ALIASES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.slice(1).map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        size="sm"
                        variant={category === cat ? "default" : "outline"}
                        onClick={() => setCategory(cat)}
                        className="rounded-full text-xs"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Confession
                  </label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Keep it kind, specific, and safe…"
                    className="min-h-24 resize-none"
                    autoFocus
                  />
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-primary/10 border border-primary/20 px-3 py-2.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    CampusOS strictly isolates your profile. This submission is
                    stored with zero user ID links.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Dialog.Close
                    render={<Button type="button" variant="ghost" size="sm">Cancel</Button>}
                  />
                  <Button type="submit" size="sm" className="rounded-full gap-1.5">
                    Whisper Anonymously
                  </Button>
                </div>
              </form>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search confession text"
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "default" : "outline"}
                className="shrink-0 rounded-full"
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">{SESSION_NOTICE}</p>
      </div>

      {/* Confessions Grid */}
      {list.length === 0 ? (
        <EmptyState
          title="The board is quiet"
          body="Try another category or share an anonymous thought."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 stagger-in">
          {list.map((c) => (
            <article
              key={c.id}
              className="interactive-card glass-surface flex flex-col justify-between rounded-3xl p-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm">
                      🤫
                    </div>
                    <div>
                      <p className="font-medium leading-tight">{c.alias}</p>
                      <p className="text-caption font-mono text-muted-foreground">
                        {c.category}
                        {c.sessionLocal ? " · this session" : " · demo"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast(
                        "Report affordance recorded locally; no moderation team has been contacted.",
                        "info"
                      )
                    }
                  >
                    Report
                  </Button>
                </div>

                <p className="mt-3 text-body leading-relaxed">&ldquo;{c.body}&rdquo;</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(["relate", "hug", "wild"] as const).map((r) => (
                      <Button
                        key={r}
                        variant="outline"
                        size="sm"
                        className="rounded-full text-caption"
                        onClick={() =>
                          update((all) =>
                            all.map((x) =>
                              x.id === c.id
                                ? {
                                    ...x,
                                    reactions: {
                                      ...x.reactions,
                                      [r]: x.reactions[r] + 1,
                                    },
                                  }
                                : x
                            )
                          )
                        }
                      >
                        {r} {c.reactions[r]}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-caption"
                      onClick={() => respond(c.id)}
                    >
                      Reply ({c.replies.length})
                    </Button>
                  </div>
                  <span className="flex items-center gap-1 text-caption font-mono text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3.5" />
                    100% Anon
                  </span>
                </div>

                {c.replies.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {c.replies.map((r) => (
                      <p
                        key={r.id}
                        className="border-l border-border pl-3 text-body-sm"
                      >
                        <span className="font-medium">{r.alias}: </span>
                        {r.body}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}