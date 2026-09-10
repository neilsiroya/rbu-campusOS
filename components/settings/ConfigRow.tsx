"use client";

import React from "react";

interface ConfigRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export default function ConfigRow({ label, description, children, isActive }: ConfigRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-xl transition-all motion-fast group",
      isActive ? "bg-primary/10 border border-primary/20" : "bg-background/40 border border-border/50 hover:border-primary/30"
    )}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{label}</span>
        {description && <span className="text-[10px] text-muted-foreground font-medium leading-tight">{description}</span>}
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
