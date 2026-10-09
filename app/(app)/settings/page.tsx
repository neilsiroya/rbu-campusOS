"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { PageIntro } from "@/components/os/PageIntro";
import { DemoNotice } from "@/components/os/DemoNotice";
import { Button } from "@/components/ui/button";
import { useSessionItems } from "@/lib/session-store";
import { SessionStorageNotice } from "@/components/os/SessionStorageNotice";

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
const preferenceSeed = [initial];
const subscribeMounted = () => () => {};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const { items, update, storageError } = useSessionItems("campusos.preferences.v2", preferenceSeed);
  const [draft, setDraft] = useState<Preferences | null>(null);
  const prefs = draft ?? items[0] ?? initial;
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof Preferences) => {
    setDraft({ ...prefs, [key]: !prefs[key] });
    setSaved(false);
  };

  const save = () => {
    update(() => [prefs]);
    setSaved(true);
  };

  const rows: Array<[keyof Preferences, string, string]> = [
    ["email", "Email updates", "A local preference only; CampusOS does not send email."],
    ["sound", "Notification sounds", "Controls this product preference only."],
    ["visible", "Public profile", "Directory profiles are currently demo records."],
    ["anonymous", "Anonymous confession composer", "Keeps the anonymous composer available in this demo."],
  ];

  return (
    <div data-controls className="space-y-6 stagger-in">
      <PageIntro
        kicker="System"
        title="Settings"
        description="Personal display and product preferences. These settings stay in this browser session."
      />
      <DemoNotice />
      <SessionStorageNotice message={storageError} />

      <section className="surface rounded-3xl p-6">
        <h2 className="text-h3">Appearance</h2>
        <p className="mt-1 text-body text-muted-foreground">Choose the CampusOS color mode.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={mounted && theme === "light" ? "default" : "outline"}
            aria-pressed={mounted && theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            variant={mounted && theme === "dark" ? "default" : "outline"}
            aria-pressed={mounted && theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            variant={mounted && theme === "system" ? "default" : "outline"}
            aria-pressed={mounted && theme === "system"}
            onClick={() => setTheme("system")}
          >
            System
          </Button>
        </div>
      </section>

      <section className="surface rounded-3xl p-6">
        <h2 className="text-h3">Preferences</h2>
        <div className="mt-3 divide-y divide-border">
          {rows.map(([key, label, detail]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-4 py-4"
            >
              <span>
                <span className="block font-medium text-foreground">{label}</span>
                <span className="block text-body-sm text-muted-foreground">{detail}</span>
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
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={save}>
            Save preferences
          </Button>
          {saved && !storageError && (
            <p role="status" data-notice="success" className="text-body-sm text-muted-foreground">Saved for this browser session.</p>
          )}
        </div>
      </section>
    </div>
  );
}
