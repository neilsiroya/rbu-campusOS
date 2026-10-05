"use client";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  size?: "sm" | "md" | "lg";
  title?: string;
  body?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeStyles = {
  spinner: { sm: "size-4", md: "size-8", lg: "size-12" },
  dots: { sm: "size-1.5", md: "size-2", lg: "size-3" },
  pulse: { sm: "h-4", md: "h-8", lg: "h-12" },
};

function Spinner({ size }: { size: "sm" | "md" | "lg" }) {
  return (
    <svg
      className={cn("animate-spin text-primary", sizeStyles.spinner[size])}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

function Dots({ size }: { size: "sm" | "md" | "lg" }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "rounded-full bg-primary animate-bounce",
            sizeStyles.dots[size]
          )}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

function Pulse({ size }: { size: "sm" | "md" | "lg" }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-primary/10 rounded-xl",
        sizeStyles.pulse[size]
      )}
      aria-hidden="true"
    />
  );
}

export function LoadingState({
  variant = "spinner",
  size = "md",
  title,
  body,
  className,
  fullScreen = false,
}: LoadingStateProps) {
  const content = (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
      {variant === "spinner" && <Spinner size={size} />}
      {variant === "dots" && <Dots size={size} />}
      {variant === "pulse" && <Pulse size={size} />}
      {variant === "skeleton" && <Pulse size={size} />}
      {title && <p className="font-display text-lg text-foreground">{title}</p>}
      {body && <p className="text-sm text-muted-foreground max-w-md">{body}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm", className)}>
        {content}
      </div>
    );
  }

  return <div className={cn("flex items-center justify-center min-h-[200px]", className)}>{content}</div>;
}

// Skeleton loading components
export function Skeleton({ className, variant = "text", lines = 3 }: { className?: string; variant?: "text" | "card" | "avatar" | "button"; lines?: number }) {
  if (variant === "card") {
    return (
      <div className={cn("space-y-4 rounded-2xl border border-border bg-card p-6 animate-pulse", className)}>
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className={cn("flex items-center gap-4 animate-pulse", className)}>
        <div className="size-12 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (variant === "button") {
    return (
      <button className={cn("h-10 w-24 rounded-xl bg-muted animate-pulse", className)} disabled aria-hidden="true" />
    );
  }

  // Default text skeleton
  return (
    <div className={cn("space-y-2 animate-pulse", className)}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}

// Page-level loading wrapper
export function PageLoading({ children, isLoading, fallback }: { children: React.ReactNode; isLoading: boolean; fallback?: React.ReactNode }) {
  if (isLoading) {
    return fallback ?? <LoadingState variant="spinner" size="lg" title="Loading…" body="Preparing your campus experience" fullScreen />;
  }
  return <>{children}</>;
}