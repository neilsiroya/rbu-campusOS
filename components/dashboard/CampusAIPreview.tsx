"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CampusAIPreviewProps {
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  "Where is Lab-4 in CS Block?",
  "Find Casio calculator on Marketplace",
  "Any Signals & Systems Unit 3 notes?",
  "Next electric shuttle to Gate 2",
];

export default function CampusAIPreview({ suggestions = DEFAULT_SUGGESTIONS }: CampusAIPreviewProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/campus-ai?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/campus-ai");
    }
  };

  return (
    <div className="intelligence-surface relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 lg:p-7">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Campus AI Console</h3>
              <p className="text-[11px] text-muted-foreground">Spatial, academic, and exchange intelligence</p>
            </div>
          </div>
          <Link
            href="/campus-ai"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Launch Console
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Quick query chips */}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {suggestions.slice(0, 4).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => router.push("/campus-ai")}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 p-3 text-left text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <span className="line-clamp-1">{suggestion}</span>
              <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask where a room is, search peer gear, or check study notes…"
          className="h-11 rounded-2xl bg-card border-border/80 text-xs"
        />
        <Button type="submit" size="sm" className="h-11 rounded-2xl px-4 gap-1.5 shrink-0">
          <Send className="size-3.5" />
          <span>Ask</span>
        </Button>
      </form>
    </div>
  );
}
