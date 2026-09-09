"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { PageIntro } from "@/components/os/PageIntro";
import { DemoNotice } from "@/components/os/DemoNotice";
import { Button } from "@/components/ui/button";

type Preferences = {
  email: boolean;
  sound: boolean;
  visible: boolean;
  anonymous: boolean;
};

const initial: Preferences = {
  email: true,
  sound: false,
  visible: true,
  anonymous: true,
};

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<Preferences>(() => {
    try {
      const raw = sessionStorage.getItem("campusos.preferences");
      if (raw) return JSON.parse(raw) as Preferences;
    } catch {
      // Ignore storage errors
    }
    return initial;
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof Preferences) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  };

  const save = () => {
    try {
      sessionStorage.setItem("campusos.preferences", JSON.stringify(prefs));
      setSaved(true);
    } catch {
      // Ignore
    }
  };

  const rows: Array<[keyof Preferences, string, string]> = [
    ["email", "Email updates", "A local preference only; CampusOS does not send email."],
    ["sound", "Notification sounds", "Controls this product preference only."],
    ["visible", "Public profile", "Directory profiles are currently demo records."],
    ["anonymous", "Anonymous confession composer", "Keeps the anonymous composer available in this demo."],
  ];

  return (
    <div className="space-y-6">
      <PageIntro
        kicker="System"
        title="Settings"
        description="Personal display and product preferences. These settings stay in this browser session."
      />
      <DemoNotice />

      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the CampusOS color mode.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={resolvedTheme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="rounded-xl"
          >
            Light
          </Button>
          <Button
            variant={resolvedTheme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="rounded-xl"
          >
            Dark
          </Button>
          <Button
            variant={resolvedTheme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
            className="rounded-xl"
          >
            System
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Preferences</h2>
        <div className="mt-3 divide-y divide-border">
          {rows.map(([key, label, detail]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-4 py-4"
            >
              <span>
                <span className="block font-medium text-foreground">{label}</span>
                <span className="block text-sm text-muted-foreground">{detail}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => toggle(key)}
                className="size-5 accent-primary"
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button className="rounded-full" onClick={save}>
            Save preferences
          </Button>
          {saved && (
            <p className="text-sm text-muted-foreground">Saved for this browser session.</p>
          )}
        </div>
      </section>
    </div>
  );
}
