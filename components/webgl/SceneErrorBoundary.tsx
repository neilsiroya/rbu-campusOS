"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sceneName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SceneErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[3D Scene "${this.props.sceneName || "Unknown"}"] WebGL fallback activated:`, error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default high-grade 2D CSS atmospheric fallback
      return (
        <div className="relative flex h-full min-h-[220px] w-full items-center justify-center overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card/80 via-background/90 to-card/60 p-6 text-center backdrop-blur-md">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_color-mix(in_oklch,var(--primary)_12%,transparent)_0%,_transparent_70%)]" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {this.props.sceneName || "CampusOS Spatial Engine"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Spatial view running in 2D accelerated fallback mode.
              </p>
            </div>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              Retry 3D Render
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
