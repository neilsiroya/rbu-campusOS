"use client";

import { useState } from "react";
import { X, Send, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { FeedPost, FeedCategory } from "@/lib/campus-data";

const CATEGORIES: FeedCategory[] = [
  "Campus",
  "Announcement",
  "Event",
  "Club",
  "Question",
  "Achievement",
];

interface PostComposerProps {
  onSubmit: (post: FeedPost) => void;
  onCancel: () => void;
}

export default function PostComposer({ onSubmit, onCancel }: PostComposerProps) {
  const [postContent, setPostContent] = useState("");
  const [category, setCategory] = useState<FeedCategory>("Campus");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost: FeedPost = {
      id: `p-${Date.now()}`,
      author: isAnonymous ? "Anonymous" : "Student User",
      handle: isAnonymous ? "anon" : "student.user",
      anonymous: isAnonymous,
      category: isAnonymous ? "Anonymous" : category,
      body: postContent.trim(),
      createdAt: new Date().toISOString(),
      reactions: { like: 0, fire: 0, insightful: 0 },
      comments: [],
      sessionLocal: true,
    };

    onSubmit(newPost);
    setPostContent("");
    setCategory("Campus");
    setIsAnonymous(false);
  };

  return (
    <Card className="glass-strong p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Create Campus Post</h3>
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
          placeholder="What's happening on campus?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span className="text-sm">Student User</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-muted-foreground" />
            <span className="text-sm">Post Anonymously</span>
            <Switch
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
          </div>
        </div>

        {!isAnonymous && (
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
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gap-2 rounded-full">
            <Send className="size-4" />
            <span>Publish Post</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
