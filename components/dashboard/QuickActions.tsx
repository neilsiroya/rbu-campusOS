"use client";

import Link from "next/link";
import {
  ShoppingBag,
  BookOpen,
  MapPin,
  ArrowRight,
  Briefcase,
} from "lucide-react";

interface QuickActionsProps {
  opportunities?: string;
}

export default function QuickActions({
  opportunities = "Explore sample internships and hackathons.",
}: QuickActionsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Campus Subsystems & Exchange
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marketplace */}
        <Link
          href="/marketplace"
          className="group activity-surface relative flex flex-col justify-between overflow-hidden rounded-3xl p-5"
        >
          <div>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <ShoppingBag className="size-5" />
            </div>
            <h4 className="mt-4 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Marketplace
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Buy, rent, or borrow cycles, calculators, books & gear.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
            <span>Explore Gear</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Study Hub */}
        <Link
          href="/notes"
          className="group activity-surface relative flex flex-col justify-between overflow-hidden rounded-3xl p-5"
        >
          <div>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <BookOpen className="size-5" />
            </div>
            <h4 className="mt-4 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Study Hub
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Peer lecture notes, PYQs, cheat sheets & lab manuals.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
            <span>Access Notes</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Campus Map */}
        <Link
          href="/map"
          className="group activity-surface relative flex flex-col justify-between overflow-hidden rounded-3xl p-5"
        >
          <div>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <MapPin className="size-5" />
            </div>
            <h4 className="mt-4 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Campus Map
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Schematic spatial layout of blocks, labs, and quads.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
            <span>Find Rooms</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Opportunities / Internships */}
        <Link
          href="/internships"
          className="group activity-surface relative flex flex-col justify-between overflow-hidden rounded-3xl p-5"
        >
          <div>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Briefcase className="size-5" />
            </div>
            <h4 className="mt-4 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Opportunities
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {opportunities}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
            <span>View Desks</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </section>
  );
}
