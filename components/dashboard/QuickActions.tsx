"use client";

import Link from "next/link";
import * as React from "react";
import {
  ShoppingBag,
  BookOpen,
  MapPin,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { StaggerContainer, StaggerItem, Reveal, HoverLift } from "@/components/motion";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  opportunities?: string;
}

export default function QuickActions({
  opportunities = "Explore sample internships and hackathons.",
}: QuickActionsProps) {
  const actions = [
    {
      href: "/marketplace",
      icon: ShoppingBag,
      color: "amber",
      title: "Marketplace",
      description: "Buy, rent, or borrow cycles, calculators, books & gear.",
      cta: "Explore Gear",
    },
    {
      href: "/notes",
      icon: BookOpen,
      color: "primary",
      title: "Study Hub",
      description: "Peer lecture notes, PYQs, cheat sheets & lab manuals.",
      cta: "Access Notes",
    },
    {
      href: "/map",
      icon: MapPin,
      color: "emerald",
      title: "Campus Map",
      description: "Schematic spatial layout of blocks, labs, and quads.",
      cta: "Find Rooms",
    },
    {
      href: "/internships",
      icon: Briefcase,
      color: "sky",
      title: "Opportunities",
      description: opportunities,
      cta: "View Desks",
    },
  ];

  const colorStyles: Record<string, string> = {
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  };

  const getIcon = (icon: typeof ShoppingBag | typeof BookOpen | typeof MapPin | typeof Briefcase) => (
    React.createElement(icon, { className: "size-5", "aria-hidden": "true" })
  );

  return (
    <section className="space-y-3">
      <Reveal delay={0.1} y={16}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Campus Subsystems & Exchange
          </p>
        </div>
      </Reveal>

      <StaggerContainer staggerDelay={0.08} delayChildren={0.15}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <StaggerItem key={action.href} delay={index * 0.02}>
              <Reveal delay={index * 0.04} y={12}>
                <HoverLift lift={4} shadow="md" borderGlow borderGlowColor="var(--primary)">
                  <Link
                    href={action.href}
                    className="group activity-surface relative flex flex-col justify-between overflow-hidden rounded-3xl p-5"
                  >
                    <div>
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                        colorStyles[action.color]
                      )}>
                        {getIcon(action.icon)}
                      </div>
                      <h4 className="mt-4 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                      <span>{action.cta}</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </HoverLift>
              </Reveal>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
}