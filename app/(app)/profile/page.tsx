"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { CURRENT_STUDENT } from "@/lib/campus-data";
import { PageIntro } from "@/components/os/PageIntro";
import { DemoNotice } from "@/components/os/DemoNotice";
type Identity = { name: string; email?: string; branch: string; year: string; authenticated: boolean };
export default function ProfilePage() {
  const [identity, setIdentity] = useState<Identity>({
    name: CURRENT_STUDENT.name,
    branch: CURRENT_STUDENT.branch,
    year: CURRENT_STUDENT.year,
    authenticated: false,
  });

  useEffect(() => {
    try {
      createClient()
        .auth.getUser()
        .then(({ data }) => {
          const user = data?.user;
          if (!user) return;
          setIdentity({
            name: String(user.user_metadata?.full_name || user.email || "Campus member"),
            email: user.email,
            branch: String(user.user_metadata?.branch || "Not provided"),
            year: String(user.user_metadata?.year || "Not provided"),
            authenticated: true,
          });
        })
        .catch(() => {
          // Gracefully fall back to demo student profile
        });
    } catch {
      // Gracefully fall back to demo student profile
    }
  }, []);

  return (
    <div className="space-y-6 stagger-in">
      <PageIntro
        kicker="Identity"
        title="Profile"
        description="Your CampusOS identity, with only account metadata that is actually available in this client."
      />
      {!identity.authenticated && (
        <DemoNotice>Showing a demo identity until an authenticated Supabase profile is available.</DemoNotice>
      )}
      <section data-surface="contained" data-surface-density="normal">
        <div className="grid size-16 place-items-center rounded-2xl bg-foreground font-display text-3xl text-background">
          {identity.name.charAt(0)}
        </div>
        <h2 className="mt-5 text-display-sm">{identity.name}</h2>
        {identity.email && <p className="mt-1 break-words text-body text-muted-foreground">{identity.email}</p>}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div data-surface="inset" data-surface-density="compact">
            <p className="text-meta text-muted-foreground">Branch</p>
            <p className="mt-1 font-medium">{identity.branch}</p>
          </div>
          <div data-surface="inset" data-surface-density="compact">
            <p className="text-meta text-muted-foreground">Year</p>
            <p className="mt-1 font-medium">{identity.year}</p>
          </div>
        </div>
        <p className="mt-5 text-caption text-muted-foreground">
          CampusOS does not expose your phone, private academic record, attendance, or location through this profile.
        </p>
      </section>
    </div>
  );
}
