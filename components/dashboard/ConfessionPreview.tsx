"use client";

import Link from "next/link";
import { Ghost, ArrowRight, Heart } from "lucide-react";
import type { Confession } from "@/lib/campus-data";

interface ConfessionPreviewProps {
  confession: Confession;
}

export default function ConfessionPreview({ confession }: ConfessionPreviewProps) {
  return (
    <article className="activity-surface relative overflow-hidden rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Ghost className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Anonymous Voices
            </p>
            <h3 className="font-display text-base font-bold text-foreground">
              Trending Confession
            </h3>
          </div>
        </div>
        <Link
          href="/confessions"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Board
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-background/50 p-4">
        <p className="font-serif italic text-sm leading-relaxed text-foreground">
          &ldquo;{confession.body}&rdquo;
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/80">{confession.alias}</span>
          <span className="flex items-center gap-1">
            <Heart className="size-3 text-rose-500" />
            {confession.reactions.relate + confession.reactions.hug} supportive
          </span>
        </div>
      </div>
    </article>
  );
}
