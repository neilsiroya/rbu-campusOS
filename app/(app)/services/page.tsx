"use client";

import { useMemo, useState } from "react";
import { SERVICES } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";
import { Input } from "@/components/ui/input";

const CATS = ["All", ...Array.from(new Set(SERVICES.map((s) => s.category)))];

export default function ServicesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = useMemo(
    () =>
      SERVICES.filter(
        (s) => (cat === "All" || s.category === cat) && `${s.name} ${s.note} ${s.contact}`.toLowerCase().includes(q.toLowerCase())
      ),
    [cat, q]
  );

  return (
    <div className="space-y-6">
      <PageIntro kicker="Campus" title="Services" description="Administration, support, transport, maintenance, library, and IT — as a directory, not a ticket system." />
      <DemoNotice />
      <div className="flex flex-col gap-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services" className="max-w-xs" />
        <FilterChips value={cat} onChange={setCat} options={CATS} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((s) => (
          <article key={s.id} className="rounded-3xl border border-border p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.category}</p>
            <h2 className="mt-2 font-display text-2xl">{s.name}</h2>
            <p className="mt-2 text-sm">{s.contact}</p>
            <p className="text-xs text-muted-foreground">{s.hours}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
