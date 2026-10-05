"use client";

import { cn } from "@/lib/utils";

export function FilterChips<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: T[];
}) {
  return (
    <div
      className="custom-scrollbar -mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0"
      role="tablist"
      aria-label="Filters"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={value === option}
          onClick={() => onChange(option)}
          className={cn(
            // 36px tall so the chips stay comfortably tappable on phones while
            // the pill shape keeps the compact density.
            "min-h-9 shrink-0 snap-start rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
            value === option
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card/70 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
