"use client";

import { useState } from "react";
import { X, Send, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Confession, ConfessionCategory } from "@/lib/campus-data";

const CATEGORIES: ConfessionCategory[] = [
  "Academics",
  "Campus",
  "Hostel",
  "Canteen",
  "Unsent",
  "Wholesome",
];

interface ConfessionComposerProps {
  onSubmit: (confession: Confession) => void;
  onCancel: () => void;
}

export default function ConfessionComposer({ onSubmit, onCancel }: ConfessionComposerProps) {
  const [confessionContent, setConfessionContent] = useState("");
  const [category, setCategory] = useState<ConfessionCategory>("Campus");
  const [alias, setAlias] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confessionContent.trim()) return;

    const newConfession: Confession = {
      id: `cf-${Date.now()}`,
      alias: alias.trim() || "Anonymous Student",
      body: confessionContent.trim(),
      category,
      createdAt: new Date().toISOString(),
      reactions: { relate: 0, hug: 0, wild: 0 },
      replies: [],
      sessionLocal: true,
    };

    onSubmit(newConfession);
    setConfessionContent("");
    setCategory("Campus");
    setAlias("");
  };

  return (
    <Card className="glass-strong p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-muted-foreground" />
            <h3 className="font-medium">Write Anonymous Confession</h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
          >
            <X className="size-4" />
          </Button>
        </div>

        <Textarea
          placeholder="Share your thoughts anonymously with campus..."
          value={confessionContent}
          onChange={(e) => setConfessionContent(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <Input
              placeholder="Alias (e.g., Midnight Owl)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category:</span>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              type="button"
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className="rounded-full text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gap-2 rounded-full">
            <Send className="size-4" />
            <span>Post Confession</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
