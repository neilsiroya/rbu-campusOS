"use client";

import { ThumbsUp, MessageSquare, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

interface ConfessionCardProps {
  confession: {
    id: string;
    alias: string;
    body: string;
    category: string;
    createdAt: string;
    reactions: number;
    comments: number;
    views: number;
  };
}

export default function ConfessionCard({ confession }: ConfessionCardProps) {
  return (
    <Card className="glass-surface">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-accent/10" />
            <div>
              <p className="font-medium">
                {confession.alias}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(confession.createdAt)} · {confession.category}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="size-4" />
          </Button>
        </div>
        <p className="mt-3 text-sm leading-relaxed">{confession.body}</p>
        <div className="mt-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <ThumbsUp className="size-4" />
            <span>{confession.reactions}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="size-4" />
            <span>{confession.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <Eye className="size-4" />
            <span>{confession.views}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}