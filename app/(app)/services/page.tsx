"use client";

import { useMemo, useState } from "react";
import { SERVICES } from "@/lib/campus-data";
import { EmptyState } from "@/components/os/EmptyState";
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
    <div className="space-y-6 stagger-in">
      <PageIntro kicker="Campus" title="Services" description="Administration, support, transport, maintenance, library, and IT — as a directory, not a ticket system." />
      <DemoNotice />
      <div className="flex flex-col gap-3 stagger-in">
        <Input aria-label="Search services" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services" className="max-w-xs" />
        <FilterChips value={cat} onChange={setCat} options={CATS} />
      </div>
      {list.length === 0 && <EmptyState title="No services match" body="Try another search or category." />}
      <div className="grid gap-4 md:grid-cols-2 stagger-in">
        {list.map((s) => (
          <article key={s.id} className="surface rounded-3xl p-5">
            <p className="text-meta text-muted-foreground">{s.category}</p>
            <h2 className="mt-2 text-h3">{s.name}</h2>
            <p className="mt-2 text-body-sm">{s.contact}</p>
            <p className="text-caption text-muted-foreground">{s.hours}</p>
            <p className="mt-3 text-body leading-relaxed text-muted-foreground">{s.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
