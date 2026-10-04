"use client";

import React from "react";
import { User, Palette, Bell, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsCategory = "identity" | "interface" | "notifications" | "security";

interface SettingsRailProps {
  activeTab: SettingsCategory;
  setActiveTab: (tab: SettingsCategory) => void;
}

const CATEGORIES: { id: SettingsCategory; label: string; icon: React.ElementType }[] = [
  { id: "identity", label: "Identity", icon: User },
  { id: "interface", label: "Interface", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function SettingsRail({ activeTab, setActiveTab }: SettingsRailProps) {
  return (
    <div className="flex flex-col gap-2 w-full sm:w-64">
      <div className="px-4 py-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">
          Configuration
        </span>
      </div>
      <nav className="space-y-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all motion-fast text-left group",
              activeTab === cat.id
                ? "bg-primary/10 text-primary shadow-sm translate-x-1 border-l-2 border-primary"
                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground border-l-2 border-transparent"
            )}
          >
            {React.createElement(cat.icon, {
              className: cn(
                "size-4 transition-colors",
                activeTab === cat.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              ) as string,
              "aria-hidden": "true"
            })}
            <span className="text-xs font-bold uppercase tracking-widest">{cat.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
