"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  Share2,
  ThumbsUp,
  X,
  Search,
  GraduationCap,
  Download,
  Flame,
  BookMarked,
} from "lucide-react";
import { STUDY_RESOURCES, type StudyResource } from "@/lib/campus-data";
import { useSessionItems } from "@/lib/session-store";
import { DemoNotice } from "@/components/os/DemoNotice";
import { SessionStorageNotice } from "@/components/os/SessionStorageNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const RESOURCE_TYPES = [
  "All",
  "Lecture notes",
  "Previous-year paper",
  "Cheat sheet",
  "Lab manual",
  "Study guide",
  "Project resource",
] as const;

const BRANCHES = ["All", "CSE", "ECE", "ME", "EE", "Design"] as const;
const YEARS = ["All", "1st", "2nd", "3rd", "4th"] as const;

export default function NotesPage() {
  const { items, prepend, update, storageError } = useSessionItems<StudyResource>(
    "campusos.study",
    STUDY_RESOURCES
  );

  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"Popular" | "Recent">("Popular");
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  // Form state
  const [form, setForm] = useState({
    title: "",
    subject: "",
    branch: "CSE",
    year: "3rd",
    type: "Lecture notes" as StudyResource["type"],
    description: "",
    tags: "",
  });

  // Filtered resources
  const filteredResources = useMemo(() => {
    return items
      .filter((r) => {
        const matchesType = selectedType === "All" || r.type === selectedType;
        const matchesBranch =
          selectedBranch === "All" || r.branch === selectedBranch || r.branch === "All";
        const matchesYear = selectedYear === "All" || r.year === selectedYear;
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          `${r.title} ${r.subject} ${r.description} ${r.uploader} ${r.tags.join(" ")}`
            .toLowerCase()
            .includes(q);
        return matchesType && matchesBranch && matchesYear && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "Popular") return b.useful - a.useful;
        return a.sessionLocal ? -1 : 1;
      });
  }, [items, selectedType, selectedBranch, selectedYear, query, sortBy]);

  // Telemetry counts
  const stats = useMemo(() => {
    const totalUseful = items.reduce((acc, curr) => acc + curr.useful, 0);
    const popularCount = items.filter((i) => i.popular).length;
    const subjects = new Set(items.map((i) => i.subject)).size;
    return { total: items.length, totalUseful, popularCount, subjects };
  }, [items]);

  const handleUpvote = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (votedIds.has(id)) return;

    setVotedIds((prev) => new Set(prev).add(id));
    update((all) =>
      all.map((item) => (item.id === id ? { ...item, useful: item.useful + 1 } : item))
    );
    if (selectedResource?.id === id) {
      setSelectedResource((prev) => (prev ? { ...prev, useful: prev.useful + 1 } : null));
    }
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.subject.trim()) return;

    const newResource: StudyResource = {
      id: `sr-${Date.now()}`,
      title: form.title.trim(),
      subject: form.subject.trim(),
      branch: form.branch,
      year: form.year,
      type: form.type,
      uploader: "Student User (You)",
      posted: "Just now",
      description: form.description.trim() || "Peer shared knowledge resource.",
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      useful: 1,
      popular: true,
      sessionLocal: true,
    };

    prepend(newResource);
    setIsSharing(false);
    setForm({
      title: "",
      subject: "",
      branch: "CSE",
      year: "3rd",
      type: "Lecture notes",
      description: "",
      tags: "",
    });
  };

  return (
    <div className="space-y-6 stagger-in">
      <PageIntro
        kicker="Academics & Knowledge"
        title="Study Hub"
        description="A student-to-student knowledge network for lecture notes, PYQs, quick revision sheets, lab manuals, and project references."
      />

      <DemoNotice>
        Study Hub records are demo materials. New resources are stored in your browser session; no external document upload is initiated.
      </DemoNotice>
      <SessionStorageNotice message={storageError} />

      {/* NexDash-inspired Knowledge Command Surface */}
      <section className="intelligence-surface relative overflow-hidden rounded-3xl p-6 lg:p-8 stagger-in">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-primary animate-pulse" />
              <p className="text-meta text-muted-foreground">
                Knowledge Network · Active Academic Session
              </p>
            </div>
            <h2 className="text-display-lg tracking-tight">
              High-yield campus materials, verified by peers.
            </h2>
            <p className="max-w-2xl text-body leading-relaxed text-muted-foreground">
              Direct access to exam question patterns, lab step-by-steps, and curated notes from top semester scorers.
            </p>

            {/* Status indicators */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <BookMarked className="size-3.5 text-primary" />
                <strong>{stats.total}</strong> Resources Indexed
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <Flame className="size-3.5 text-amber-500" />
                <strong>{stats.popularCount}</strong> Trending Materials
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <GraduationCap className="size-3.5 text-emerald-500" />
                <strong>{stats.subjects}</strong> Subjects Covered
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <ThumbsUp className="size-3.5 text-purple-500" />
                <strong>{stats.totalUseful}</strong> Peer Endorsements
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Button
              onClick={() => setIsSharing(true)}
              className="gap-2 rounded-full shadow-lg shadow-primary/20 px-6 py-6 text-sm font-semibold"
            >
              <Share2 className="size-4" />
              Share Resource
            </Button>
          </div>
        </div>
      </section>

      {/* Type Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 custom-scrollbar">
        {RESOURCE_TYPES.map((type) => {
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={cn(
                "shrink-0 rounded-2xl border px-3.5 py-2 text-xs font-medium transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/80 bg-card hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects (Signals, OS, BEE), topics, tags, or authors…"
            className="pl-10 h-11 rounded-2xl bg-card border-border/80 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Branch filter */}
          <select
            aria-label="Filter by branch"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground outline-none"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b === "All" ? "All Branches" : b}
              </option>
            ))}
          </select>

          {/* Year filter */}
          <select
            aria-label="Filter by academic year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground outline-none"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y === "All" ? "All Years" : `${y} Year`}
              </option>
            ))}
          </select>

          {/* Sort selector */}
          <div className="flex rounded-2xl border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setSortBy("Popular")}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                sortBy === "Popular"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Most Useful
            </button>
            <button
              type="button"
              onClick={() => setSortBy("Recent")}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                sortBy === "Recent"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Recent
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Study Resources */}
      {filteredResources.length === 0 ? (
        <EmptyState
          title="No study resources found"
          body="No materials match the active search and filter criteria. Share your own study guide to seed this lane."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((item) => {
            const hasVoted = votedIds.has(item.id);

            return (
              <article
                key={item.id}
                onClick={() => setSelectedResource(item)}
                className="interactive-card group relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 cursor-pointer"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-accent/10 to-transparent text-primary">
                        <BookOpen className="size-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.subject}
                        </span>
                        <p className="text-xs text-muted-foreground">{item.posted}</p>
                      </div>
                    </div>

                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      {item.type}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-5 border-t border-border/70 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                        {item.branch} · {item.year}
                      </span>
                      <span className="truncate max-w-[110px]">{item.uploader}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleUpvote(item.id, e)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all",
                        hasVoted
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border/80 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <ThumbsUp className={cn("size-3.5", hasVoted && "fill-current text-primary")} />
                      <span>{item.useful}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close resource modal"
            onClick={() => setSelectedResource(null)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Resource detail"
            className="glass-rich relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full"
              onClick={() => setSelectedResource(null)}
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <FileText className="size-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {selectedResource.type} · {selectedResource.subject}
                </span>
                <p className="text-xs text-muted-foreground">Uploaded {selectedResource.posted}</p>
              </div>
            </div>

            <h2 className="mt-4 font-display text-2xl font-bold leading-tight pr-8">
              {selectedResource.title}
            </h2>

            {/* Subject & Branch Meta Box */}
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-background/50 p-3 text-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Target Branch
                </p>
                <p className="mt-0.5 text-xs font-bold text-foreground">{selectedResource.branch}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Year
                </p>
                <p className="mt-0.5 text-xs font-bold text-foreground">{selectedResource.year} Year</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Upvotes
                </p>
                <p className="mt-0.5 text-xs font-bold text-primary">{selectedResource.useful} Helpful</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Resource Summary & Notes
              </h4>
              <p className="text-sm leading-relaxed text-foreground/90">
                {selectedResource.description}
              </p>
            </div>

            {/* Tags */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Topics & Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedResource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl bg-muted px-3 py-1 text-xs font-medium text-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Contributor note */}
            <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                Shared by {selectedResource.uploader}
              </p>
              <p className="mt-1">
                Verified campus resource preview. In this interactive demo build, simulated offline study caching is active.
              </p>
            </div>

            {/* Action Bar */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-full gap-2"
                onClick={() => handleUpvote(selectedResource.id)}
              >
                <ThumbsUp className="size-4 text-primary" />
                {votedIds.has(selectedResource.id) ? "Marked as Useful" : "Upvote Resource"}
              </Button>
              <Button
                className="rounded-full gap-2"
                onClick={() => alert("Simulated download: PDF resource cached for offline study in your session.")}
              >
                <Download className="size-4" />
                Download PDF Preview
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Share Modal */}
      {isSharing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Share resource"
            className="glass-rich relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Share2 className="size-5" />
                </div>
                <h2 className="font-display text-xl font-bold">Share Study Resource</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSharing(false)}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Add lecture notes, previous year question solutions, or revision cheat sheets for your peers.
            </p>

            <form onSubmit={handleShare} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resource Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Signals & Systems Complete Unit 3 Notes"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Subject Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Operating Systems, BEE"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Resource Type
                  </label>
                  <select
                    aria-label="Resource type"
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as StudyResource["type"] })
                    }
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium"
                  >
                    <option value="Lecture notes">Lecture notes</option>
                    <option value="Previous-year paper">Previous-year paper</option>
                    <option value="Cheat sheet">Cheat sheet</option>
                    <option value="Lab manual">Lab manual</option>
                    <option value="Study guide">Study guide</option>
                    <option value="Project resource">Project resource</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Branch
                  </label>
                  <select
                    aria-label="Target branch"
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="EE">EE</option>
                    <option value="Design">Design</option>
                    <option value="All">All Branches</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Year
                  </label>
                  <select
                    aria-label="Academic year"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium"
                  >
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tags (comma separated)
                </label>
                <Input
                  placeholder="e.g. Fourier, Unit 3, Exam Prep, Formulas"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description & Key Topics
                </label>
                <Textarea
                  placeholder="Explain what this covers, which professors or syllabus units it aligns with…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="min-h-[90px] rounded-xl text-xs"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setIsSharing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full">
                  Share into Hub (Session)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
