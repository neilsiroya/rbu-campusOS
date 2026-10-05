"use client";

import React, { Component, type ReactNode } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SceneErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("[CampusOS WebGL Warning]:", error.message, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full min-h-[240px] flex-col items-center justify-center rounded-2xl border border-border/40 bg-card/60 p-6 text-center backdrop-blur-md">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <p className="font-display text-sm font-semibold text-foreground">
            {this.props.fallbackTitle || "Spatial Canvas Offline"}
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {this.props.fallbackMessage ||
              "Running in high-compatibility 2D mode for optimal speed and battery life."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 gap-1.5 rounded-full text-xs"
            onClick={() => this.setState({ hasError: false })}
          >
            <RefreshCw className="size-3" />
            Retry Viewport
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
