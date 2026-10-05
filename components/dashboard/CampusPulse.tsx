"use client";

import Link from "next/link";
import { ArrowRight, Newspaper, MessageSquare, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type FeedPost } from "@/lib/campus-data";
import { formatRelativeTime } from "@/lib/utils";
import { StaggerContainer, StaggerItem, Reveal } from "@/components/motion";

interface CampusPulseProps {
  posts: FeedPost[];
}

export default function CampusPulse({ posts }: CampusPulseProps) {
  return (
    <article className="activity-surface relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 lg:col-span-7">
      <Reveal delay={0.1} y={20}>
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Newspaper className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Community Pulse
                </p>
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                  Campus Feed Highlights
                </h2>
              </div>
            </div>
            <Link
              href="/feed"
              className="inline-flex min-h-8 items-center gap-1 py-2 text-xs font-semibold text-primary hover:underline"
            >
              All posts
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="mt-5 space-y-3.5">
            <StaggerContainer staggerDelay={0.06} delayChildren={0.2}>
              {posts.slice(0, 3).map((post) => (
                <StaggerItem key={post.id}>
                  <div className="interactive-card rounded-2xl p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        {post.anonymous ? "Anonymous Student" : post.author}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatRelativeTime(post.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {post.body}
                    </p>
                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="size-3 text-amber-500" />
                        {post.reactions.like + post.reactions.fire} reactions
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="size-3" />
                        {post.comments.length} comments
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.5} y={16}>
        <div className="mt-5 pt-3 border-t border-border/70 flex justify-end">
          <Link href="/feed">
            <button className="min-h-11 gap-2 rounded-full text-xs font-medium px-4 inline-flex items-center justify-center gap-2 text-primary hover:underline">
              Join the Conversation
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
