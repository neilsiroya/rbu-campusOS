"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const QUICK_QUERIES = [
  "Find scientific calculator under ₹500",
  "Where is the Robotics Innovation Lab?",
  "What is my next class?",
  "Check shuttle bus timing",
];

export default function CampusAIQuickAsk() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/campus-ai?q=${encodeURIComponent(query.trim())}`);
  };

  const handleChipClick = (starter: string) => {
    setQuery(starter);
    router.push(`/campus-ai?q=${encodeURIComponent(starter)}`);
  };

  return (
    <Card className="overflow-hidden rounded-3xl border border-border bg-card p-0 shadow-sm">
      <section
        aria-labelledby="campus-ai-quick-ask-title"
        className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
      >
        <div className="border-b border-border bg-muted/35 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2
                id="campus-ai-quick-ask-title"
                className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
              >
                Campus AI OS Assistant
              </h2>
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted-foreground">
                Ask about library open hours, drafter listings, room directions, or faculty contacts
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <label htmlFor="campus-ai-query" className="text-sm font-medium text-foreground">
              Ask a campus question
            </label>
            <div className="flex gap-2">
              <Input
                id="campus-ai-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Where is Computing Lab-4?"
                className="h-12 min-w-0 flex-1 rounded-xl border-border bg-background px-3.5 text-base text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button
                type="submit"
                size="sm"
                className="h-12 shrink-0 rounded-xl px-4 text-sm font-semibold"
              >
                Ask
                <Send className="ml-1.5 size-4" aria-hidden="true" />
              </Button>
            </div>
          </form>

          <div
            role="group"
            aria-label="Suggested campus questions"
            className="mt-5 border-t border-border pt-4"
          >
            <p className="mb-2.5 text-xs font-medium text-muted-foreground">Try a question</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUERIES.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => handleChipClick(starter)}
                  className="min-h-11 touch-manipulation rounded-full border border-border bg-background px-3.5 py-2 text-left text-xs leading-snug text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Card>
  );
}
