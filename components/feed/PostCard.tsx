"use client";

import { ThumbsUp, MessageSquare, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    author: string;
    body: string;
    category: string;
    anonymous: boolean;
    createdAt: string;
    reactions: number;
    comments: number;
    views: number;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="glass-surface">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-primary/10" />
            <div>
              <p className="font-medium">
                {post.anonymous ? "Anonymous" : post.author}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(post.createdAt)} · {post.category}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="size-4" />
          </Button>
        </div>
        <p className="mt-3 text-sm leading-relaxed">{post.body}</p>
        <div className="mt-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <ThumbsUp className="size-4" />
            <span>{post.reactions}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="size-4" />
            <span>{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <Eye className="size-4" />
            <span>{post.views}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}