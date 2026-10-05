"use client";

import { motion, useReducedMotion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

export type AnimatedBackgroundItem = {
  id: string;
  element: React.ReactNode;
  content: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  active?: boolean;
  className?: string;
};

interface CampusAnimatedBackgroundProps {
  items: AnimatedBackgroundItem[];
  activeId?: string | null;
  onActiveChange?: (id: string) => void;
  direction?: "horizontal" | "vertical";
  indicatorClassName?: string;
  containerClassName?: string;
  itemClassName?: string;
  layoutGroupName?: string;
}

export function CampusAnimatedBackground({
  items,
  activeId,
  onActiveChange,
  direction = "vertical",
  indicatorClassName,
  containerClassName,
  itemClassName,
  layoutGroupName = "campus-animated-bg",
}: CampusAnimatedBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const [localActive, setLocalActive] = React.useState<string | null>(
    activeId ?? items[0]?.id ?? null
  );

  const active = activeId ?? localActive;

  const handleSelect = (item: AnimatedBackgroundItem) => {
    if (item.disabled) return;
    if (activeId == null) setLocalActive(item.id);
    onActiveChange?.(item.id);
    item.onClick?.();
  };

  if (shouldReduceMotion) {
    return (
      <div
        role={direction === "vertical" ? "tablist" : "menu"}
        aria-orientation={direction}
        className={cn(
          direction === "vertical" ? "flex flex-col gap-1" : "flex items-center gap-1",
          containerClassName
        )}
      >
        {items.map((item) => {
          const isActive = active === item.id;
          const Wrapper: React.ElementType = item.href ? "a" : "button";
          return (
            <Wrapper
              key={item.id}
              href={item.href}
              onClick={() => handleSelect(item)}
              disabled={item.disabled}
              role={direction === "vertical" ? "tab" : "menuitem"}
              aria-selected={isActive}
              className={cn(
                "relative rounded-xl px-3 py-2 text-left outline-none motion-tier-interaction",
                isActive && "bg-primary/10 text-primary",
                item.className,
                itemClassName
              )}
            >
              {item.content}
            </Wrapper>
          );
        })}
      </div>
    );
  }

  return (
    <LayoutGroup id={layoutGroupName}>
      <div
        role={direction === "vertical" ? "tablist" : "menu"}
        aria-orientation={direction}
        className={cn(
          "relative",
          direction === "vertical" ? "flex flex-col gap-1" : "flex items-center gap-1",
          containerClassName
        )}
      >
        {items.map((item) => {
          const isActive = active === item.id;
          const Wrapper: React.ElementType = item.href ? "a" : "button";
          return (
            <Wrapper
              key={item.id}
              href={item.href}
              onClick={() => handleSelect(item)}
              disabled={item.disabled}
              role={direction === "vertical" ? "tab" : "menuitem"}
              aria-selected={isActive}
              className={cn(
                "relative z-10 rounded-xl px-3 py-2 text-left outline-none motion-tier-interaction",
                item.disabled && "opacity-50 pointer-events-none",
                item.className,
                itemClassName
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={`${layoutGroupName}-pill`}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className={cn(
                    "absolute inset-0 -z-10 rounded-xl bg-primary/10 border-l-2 border-primary",
                    indicatorClassName
                  )}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10">{item.content}</span>
            </Wrapper>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
