"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorState } from "./EmptyState";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallbackTitle?: string;
  fallbackBody?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <ErrorState
              title={this.props.fallbackTitle ?? "Something went wrong"}
              body={this.props.fallbackBody ?? "An unexpected error occurred. Please try again or contact support if the problem persists."}
              onRetry={this.props.showRetry !== false ? this.handleRetry : undefined}
            />
            {this.state.error && process.env.NODE_ENV === "development" && (
              <details className="mt-6 rounded-xl border border-border bg-muted/50 p-4 text-xs font-mono text-muted-foreground">
                <summary className="cursor-pointer font-medium text-foreground mb-2">Error Details (Development)</summary>
                <pre className="whitespace-pre-wrap break-all text-red-500">{this.state.error?.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundaries for different contexts
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="Page unavailable"
      fallbackBody="This page encountered an error and couldn't load properly."
      showRetry={true}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({
  children,
  fallbackTitle = "Component unavailable",
  fallbackBody = "This component couldn't load. Please refresh the page.",
}: { children: ReactNode; fallbackTitle?: string; fallbackBody?: string }) {
  return (
    <ErrorBoundary
      fallbackTitle={fallbackTitle}
      fallbackBody={fallbackBody}
      showRetry={true}
    >
      {children}
    </ErrorBoundary>
  );
}

export function AsyncErrorBoundary({
  children,
  fallbackTitle = "Failed to load",
  fallbackBody = "Unable to load this content. Please try again.",
}: { children: ReactNode; fallbackTitle?: string; fallbackBody?: string }) {
  return (
    <ErrorBoundary
      fallbackTitle={fallbackTitle}
      fallbackBody={fallbackBody}
      showRetry={true}
    >
      {children}
    </ErrorBoundary>
  );
}