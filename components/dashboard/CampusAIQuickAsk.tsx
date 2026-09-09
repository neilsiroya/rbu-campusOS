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
  "What is the next exam venue?",
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
    // Optional: Auto-submit on chip click
    router.push(`/campus-ai?q=${encodeURIComponent(starter)}`);
  };

  return (
    <Card className="p-4 sm:p-5 bg-gradient-to-r from-card to-muted/30 border-primary/20 backdrop-blur-xl shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-primary/15 text-primary">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-foreground">
            Campus AI OS Assistant
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Ask about library open hours, drafter listings, room directions, or faculty contacts
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Where is Computing Lab-4? or Show scientific calculator listings..."
          className="flex-1 h-10 px-3.5 py-2 text-xs rounded-xl bg-background/80 border border-border/80 text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <Button type="submit" size="sm" className="px-4 text-xs font-semibold h-10 rounded-xl shadow-md shadow-primary/20">
          Query <Send className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </form>

      {/* Starter suggestion chips */}
      <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-border/30">
        <span className="text-[10px] text-muted-foreground mr-1 self-center">Try:</span>
        {QUICK_QUERIES.map((starter, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(starter)}
            className="px-2 py-0.5 rounded-full bg-muted/50 hover:bg-primary/15 border border-border/60 hover:border-primary/40 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {starter}
          </button>
        ))}
      </div>
    </Card>
  );
}
