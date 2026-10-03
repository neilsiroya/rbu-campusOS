import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  compact?: boolean;
  className?: string;
  showTagline?: boolean;
}

export function BrandMark({
  href = "/dashboard",
  compact = false,
  className,
  showTagline = false,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn("group flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90", className)}
    >
      {/* Refined Geometric CampusOS Monogram / Emblem */}
      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80 p-[1px] shadow-sm shadow-foreground/10 ring-1 ring-border/80 transition-transform group-hover:scale-[1.02]">
        <div className="flex size-full items-center justify-center rounded-[11px] bg-background">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 text-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          >
            {/* Outer precision node shield */}
            <path
              d="M12 2.5L20 7.2V16.8L12 21.5L4 16.8V7.2L12 2.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            />
            {/* Core RBU Nexus geometry */}
            <path
              d="M12 6.5V17.5M12 6.5L17 9.5V14.5L12 17.5M12 6.5L7 9.5V14.5L12 17.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
            {/* Central energy core */}
            <circle cx="12" cy="12" r="1.8" fill="currentColor" className="text-primary" />
          </svg>
        </div>
      </div>

      {/* Brand Lockup */}
      <div className="flex min-w-0 flex-col leading-none">
        <span className="text-[10px] font-bold tracking-[0.24em] text-primary">
          RBU
        </span>
        <span
          className={cn(
            "font-display font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/90",
            compact ? "text-base" : "text-lg"
          )}
        >
          Campus<span className="text-primary">OS</span>
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[10px] text-muted-foreground">
            Digital Campus Operating System
          </span>
        )}
      </div>
    </Link>
  );
}
