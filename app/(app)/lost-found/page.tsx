"use client";

import { useMemo, useState } from "react";
import { LOST_FOUND, SESSION_NOTICE, type LostFoundItem } from "@/lib/campus-data";
import { useSessionItems } from "@/lib/session-store";
import { DemoNotice } from "@/components/os/DemoNotice";
import { SessionStorageNotice } from "@/components/os/SessionStorageNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LostFoundPage() {
  const { items, prepend, storageError } = useSessionItems<LostFoundItem>("campusos.lostfound", LOST_FOUND);
  const [kind, setKind] = useState<"All" | "lost" | "found">("All");
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ kind: "lost" as "lost" | "found", title: "", location: "", category: "Other" as LostFoundItem["category"], description: "" });
  const [note, setNote] = useState("");
  const [contacted, setContacted] = useState<string[]>([]);

  const list = useMemo(
    () =>
      items.filter(
        (i) =>
          (kind === "All" || i.kind === kind) &&
          `${i.title} ${i.location} ${i.description}`.toLowerCase().includes(q.toLowerCase())
      ),
    [items, kind, q]
  );

  return (
    <div className="space-y-6 stagger-in">
      <PageIntro
        kicker="Community"
        title="Lost & Found"
        description="Listings with a place, a date, and a way to reclaim — without pretending the desk is staffed by a server."
      />
      <DemoNotice />
      <SessionStorageNotice message={storageError} />

      <section className="glass rounded-3xl p-5">
        <p className="text-body font-medium">New listing</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 stagger-in">
          <select
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value as "lost" | "found" })}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as LostFoundItem["category"] })}
          >
            {["ID", "Electronics", "Books", "Apparel", "Other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Last seen / found at" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <textarea
            className="min-h-20 rounded-xl border border-input bg-background p-2 text-sm sm:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">{SESSION_NOTICE}</p>
          <Button
            className="rounded-full"
            onClick={() => {
              if (!form.title.trim() || !form.location.trim()) return;
              prepend({
                id: crypto.randomUUID(),
                kind: form.kind,
                title: form.title.trim(),
                location: form.location.trim(),
                date: "Today",
                category: form.category,
                description: form.description.trim() || "No extra detail.",
                status: "Open",
                sessionLocal: true,
              });
              setForm({ ...form, title: "", location: "", description: "" });
              setNote("Listing stored in this browser session only.");
            }}
          >
            List item
          </Button>
        </div>
        {note ? <p className="mt-2 text-caption text-muted-foreground">{note}</p> : null}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center stagger-in">
        <FilterChips value={kind} onChange={setKind} options={["All", "lost", "found"]} />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listings" className="sm:max-w-xs" />
      </div>

      {list.length === 0 ? (
        <EmptyState title="No listings" body="Try another filter, or add a session listing above." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 stagger-in">
          {list.map((item) => (
            <article key={item.id} className="interactive-card overflow-hidden rounded-3xl">
              <div className="flex h-32 items-end bg-muted px-5 py-4">
                <p className="text-meta text-muted-foreground">
                  {item.kind} · {item.category}
                </p>
              </div>
              <div className="p-5">
                <h2 className="text-h4">{item.title}</h2>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  {item.location} · {item.date} · {item.status}
                  {item.sessionLocal ? " · this session" : ""}
                </p>
                <p className="mt-3 text-body leading-relaxed">{item.description}</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-full"
                  onClick={() => {
                    setContacted((ids) => [...ids, item.id]);
                    setNote("Contact/reclaim is a UI action only. No message was sent.");
                  }}
                >
                  {contacted.includes(item.id) ? "Noted (this session)" : "Contact / reclaim"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
