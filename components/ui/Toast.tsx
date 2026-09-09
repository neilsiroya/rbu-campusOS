"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "cn";
import { useToast } from "@/lib/toast-context";

const variantStyles = {
  success: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  error: "border-destructive/30 text-destructive",
  info: "border-primary/30 text-primary",
} as const;

const variantIcons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
} as const;

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-xs flex-col gap-2 sm:bottom-5 sm:right-5">
      {toasts.map((t) => {
        const Icon = variantIcons[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "glass-panel flex items-start gap-3 rounded-2xl border p-3.5 shadow-lg backdrop-blur-xl animate-[toast-in_0.2s_ease-out]",
              variantStyles[t.variant]
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <p className="flex-1 text-xs font-medium text-foreground">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}