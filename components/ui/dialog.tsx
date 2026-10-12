"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Base UI retains modal, focus, dismissal and accessible-name behavior. */
export function DialogContent({ className, children, ...props }: Dialog.Popup.Props) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="campus-dialog-backdrop" />
      <Dialog.Popup data-surface="overlay" data-controls className={cn("campus-dialog", className)} {...props}>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("campus-overlay-header", className)} {...props} />;
}

export function DialogBody({ className, onFocusCapture, ...props }: ComponentProps<"div">) {
  return <div className={cn("campus-overlay-body", className)} {...props} onFocusCapture={(event) => {
    onFocusCapture?.(event);
    // Base UI may focus with preventScroll. Keep that focus inside this region
    // without moving the dialog header, footer or underlying page.
    const body = event.currentTarget;
    const target = event.target.getBoundingClientRect();
    const bounds = body.getBoundingClientRect();
    if (target.bottom > bounds.bottom - 8) body.scrollTop += target.bottom - bounds.bottom + 8;
    else if (target.top < bounds.top + 8) body.scrollTop -= bounds.top - target.top + 8;
  }} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("campus-overlay-footer", className)} {...props} />;
}
