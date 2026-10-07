import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  compact?: boolean;
  className?: string;
  showTagline?: boolean;
  onClick?: () => void;
}

export function BrandMark({
  href = "/dashboard",
  compact = false,
  className,
  showTagline = false,
  onClick,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="RBU CampusOS home"
      className={cn("campus-brand group flex min-h-11 min-w-0 items-center gap-2.5", className)}
    >
      <div className="campus-brand-symbol relative flex size-9 shrink-0 items-center justify-center border border-foreground/20 bg-foreground text-background">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            aria-hidden="true"
          >
            <path
              d="M4 16V8L12 4L20 8V16L12 20L4 16ZM4 8L12 12L20 8M12 12V20"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="miter"
            />
            <path
              d="M8 6L16 10V18"
              stroke="currentColor"
              strokeWidth="1.4"
              className="opacity-50"
            />
          </svg>
      </div>

      <div className="campus-brand-wordmark flex min-w-0 flex-col gap-1 leading-none">
        <span className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground">
          RBU
        </span>
        <span
          className={cn(
            "font-display font-semibold tracking-[-0.045em] text-foreground",
            compact ? "text-base" : "text-lg"
          )}
        >
          Campus<span className="font-normal">OS</span>
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
