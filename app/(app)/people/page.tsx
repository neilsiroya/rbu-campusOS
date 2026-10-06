"use client";

import { useMemo, useState } from "react";
import { PEOPLE } from "@/lib/campus-data";
import { DemoNotice } from "@/components/os/DemoNotice";
import { FilterChips } from "@/components/os/FilterChips";
import { PageIntro } from "@/components/os/PageIntro";
import { EmptyState } from "@/components/os/EmptyState";
import { Input } from "@/components/ui/input";

const YEARS = ["All", "2nd", "3rd", "4th"] as const;

export default function PeoplePage() {
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>("All");

  const list = useMemo(
    () =>
      PEOPLE.filter(
        (p) =>
          (year === "All" || p.year === year) &&
          `${p.name} ${p.branch} ${p.interests.join(" ")} ${p.clubs.join(" ")}`.toLowerCase().includes(q.toLowerCase())
      ),
    [q, year]
  );

  return (
    <div className="space-y-6 stagger-in">
      <PageIntro
        kicker="Community"
        title="People"
        description="A campus directory of public-facing student profiles. No emails, phones, or private academic records."
      />
      <DemoNotice />
      <div className="flex flex-col gap-3 sm:flex-row stagger-in">
        <Input aria-label="Search people by name, club, or interest" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, club, interest" className="sm:max-w-xs" />
        <FilterChips value={year} onChange={setYear} options={[...YEARS]} />
      </div>
      {list.length === 0 && <EmptyState title="No people match" body="Try another name, interest, or year." />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-in">
        {list.map((person) => (
          <article key={person.id} className="surface rounded-3xl p-5">
            <div className="grid size-12 place-items-center rounded-2xl bg-muted font-display text-xl">
              {person.name.charAt(0)}
            </div>
            <h2 className="mt-4 text-h4">{person.name}</h2>
            <p className="text-body-sm text-muted-foreground">
              {person.branch} · {person.year} year
            </p>
            <p className="mt-3 text-caption text-muted-foreground">{person.interests.join(" · ")}</p>
            <p className="mt-2 text-caption">{person.clubs.join(", ")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
