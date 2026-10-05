"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  variant?: "default" | "loading" | "error" | "success" | "warning";
  title: string;
  body?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-4 py-8",
  md: "px-6 py-12",
  lg: "px-8 py-16",
};

const variantIcons = {
  default: (
    <svg className="size-12 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6v6H9z" />
    </svg>
  ),
  loading: (
    <svg className="size-12 text-primary animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  ),
  error: (
    <svg className="size-12 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  success: (
    <svg className="size-12 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg className="size-12 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L21.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
};

const variantStyles = {
  default: "border-border bg-card",
  loading: "border-primary/30 bg-primary/5",
  error: "border-destructive/30 bg-destructive/5",
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
};

export function EmptyState({
  variant = "default",
  title,
  body,
  icon,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-dashed",
      variantStyles[variant],
      sizeStyles[size],
      "text-center transition-all duration-300",
      className
    )}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
        {icon ?? variantIcons[variant]}
      </div>
      <p className="font-display text-xl text-foreground">{title}</p>
      {body && (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      )}
      {action && (
        <div className="mt-6 flex justify-center">{action}</div>
      )}
    </div>
  );
}

// Specialized empty states for common use cases
export function EmptySearchState({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      variant="default"
      title={query ? `No results for "${query}"` : "No results found"}
      body={query
        ? "Try adjusting your search terms or filters"
        : "Start typing to search across campus"}
      icon={
        <svg className="size-12 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      }
      action={onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-primary hover:underline"
        >
          Clear search
        </button>
      ) : null}
    />
  );
}

export function EmptyCollectionState({
  title = "Nothing here yet",
  body = "Get started by adding your first item",
  action,
}: { title?: string; body?: string; action?: React.ReactNode }) {
  return (
    <EmptyState
      variant="default"
      title={title}
      body={body}
      icon={
        <svg className="size-12 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6v6H9z" />
        </svg>
      }
      action={action}
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  body = "Please try again or contact support if the problem persists",
  onRetry,
}: { title?: string; body?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      variant="error"
      title={title}
      body={body}
      action={onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4v16h16" />
            <path d="M4 4l16 16" />
          </svg>
          Try again
        </button>
      ) : null}
    />
  );
}

export function LoadingState({
  title = "Loading…",
  body = "Please wait while we fetch the data",
}: { title?: string; body?: string }) {
  return (
    <EmptyState
      variant="loading"
      title={title}
      body={body}
    />
  );
}