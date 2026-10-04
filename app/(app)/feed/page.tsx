"use client";

import { useMemo, useState } from "react";
import { FEED_POSTS, SESSION_NOTICE, type FeedCategory, type FeedPost } from "@/lib/campus-data";
import { useSessionItems } from "@/lib/session-store";
import { DemoNotice } from "@/components/os/DemoNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const categories: Array<"All" | FeedCategory> = ["All", "Campus", "Announcement", "Event", "Club", "Question", "Achievement", "Anonymous"];
export default function CampusFeedPage() {
  const { items: posts, prepend, update } = useSessionItems<FeedPost>("campusos.feed", FEED_POSTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [body, setBody] = useState("");
  const [note, setNote] = useState("");
  const list = useMemo(() => posts.filter((p) => (category === "All" || p.category === category) && `${p.author} ${p.body} ${p.category}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [posts, category, query]);
  const react = (id: string, reaction: keyof FeedPost["reactions"]) => update((items) => items.map((p) => p.id === id ? { ...p, reactions: { ...p.reactions, [reaction]: p.reactions[reaction] + 1 } } : p));
  const reply = (id: string) => { const text = window.prompt("Write a reply (stored for this session only):"); if (!text?.trim()) return; update((items) => items.map((p) => p.id === id ? { ...p, comments: [...p.comments, { id: crypto.randomUUID(), author: "Student User", anonymous: false, body: text.trim(), createdAt: new Date().toISOString() }] } : p)); };
  return <div className="space-y-6 stagger-in"><PageIntro kicker="Community" title="Campus Feed" description="Campus conversations, questions, clubs, and announcements — using demo data plus posts held in this browser session." /><DemoNotice />
    <section className="glass rounded-3xl p-5"><label htmlFor="feed-post" className="text-body font-medium">Start a campus conversation</label><Textarea id="feed-post" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share something useful with campus…" className="mt-3 min-h-24" /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><select aria-label="Post category" className="h-9 rounded-lg border border-input bg-background px-2 text-sm" value={category === "All" ? "Campus" : category} onChange={(e) => setCategory(e.target.value as FeedCategory)}>{categories.slice(1).map((c) => <option key={c}>{c}</option>)}</select><Button className="rounded-full" onClick={() => { if (!body.trim()) return; prepend({ id: crypto.randomUUID(), author: "Student User", handle: "student", anonymous: false, category: category === "All" ? "Campus" : category, body: body.trim(), createdAt: new Date().toISOString(), reactions: { like: 0, fire: 0, insightful: 0 }, comments: [], sessionLocal: true }); setBody(""); setNote("Post kept in this browser session only."); }}>Post to session</Button></div><p className="mt-2 text-caption text-muted-foreground">{note || SESSION_NOTICE}</p></section>
    <div className="flex flex-col gap-3 sm:flex-row stagger-in"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the feed" className="sm:max-w-xs" /><div className="flex gap-2 overflow-x-auto pb-1">{categories.map((c) => <Button key={c} size="sm" variant={category === c ? "default" : "outline"} className="shrink-0 rounded-full" onClick={() => setCategory(c)}>{c}</Button>)}</div></div>
    {list.length === 0 ? <EmptyState title="No campus posts here" body="Try another category or share the first update." /> : <div className="space-y-4 stagger-in">{list.map((post) => <article key={post.id} className="interactive-card rounded-3xl p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{post.anonymous ? "Anonymous" : post.author}</p><p className="text-caption text-muted-foreground">{post.category}{post.sessionLocal ? " · this session" : " · demo"}</p></div><span className="text-caption text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span></div><p className="mt-3 text-body leading-relaxed">{post.body}</p><div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => react(post.id, "like")}>Like {post.reactions.like}</Button><Button variant="outline" size="sm" onClick={() => react(post.id, "fire")}>Fire {post.reactions.fire}</Button><Button variant="outline" size="sm" onClick={() => react(post.id, "insightful")}>Insightful {post.reactions.insightful}</Button><Button variant="ghost" size="sm" onClick={() => reply(post.id)}>Reply ({post.comments.length})</Button></div>{post.comments.length > 0 && <div className="mt-4 space-y-2 border-l border-border pl-3">{post.comments.map((comment) => <p key={comment.id} className="text-body-sm"><span className="font-medium">{comment.anonymous ? "Anonymous" : comment.author}: </span>{comment.body}</p>)}</div>}</article>)}</div>}
  </div>;
}
