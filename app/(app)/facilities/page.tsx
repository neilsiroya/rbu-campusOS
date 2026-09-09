"use client";

import { useMemo, useState } from "react";
import { FACILITIES } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";
import { Input } from "@/components/ui/input";

const CATS = ["All", ...Array.from(new Set(FACILITIES.map((f) => f.category)))];

export default function FacilitiesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = useMemo(
    () =>
      FACILITIES.filter(
        (f) => (cat === "All" || f.category === cat) && `${f.name} ${f.note} ${f.location}`.toLowerCase().includes(q.toLowerCase())
      ),
    [cat, q]
  );

  return (
    <div className="space-y-6">
      <PageIntro kicker="Campus" title="Facilities" description="Labs, library, sports, halls, classrooms, food, and care." />
      <DemoNotice />
      <div className="flex flex-col gap-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search facilities" className="max-w-xs" />
        <FilterChips value={cat} onChange={setCat} options={CATS} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((f) => (
          <article key={f.id} className="rounded-3xl border border-border p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{f.category}</p>
            <h2 className="mt-2 font-display text-2xl">{f.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{f.location} · {f.hours}</p>
            <p className="mt-3 text-sm leading-relaxed">{f.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
