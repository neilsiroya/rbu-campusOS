"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface FootprintItem {
  label: string;
  category: "Club" | "Role" | "Cert";
  value: string;
  icon: React.ElementType;
  color: string;
}

const DEMO_FOOTPRINT: FootprintItem[] = [
  { label: "Robotics Society", category: "Club", value: "Core Member", icon: Users, color: "text-blue-400" },
  { label: "Cloud Architect", category: "Cert", value: "AWS Certified", icon: Award, color: "text-yellow-400" },
  { label: "Campus Ambassador", category: "Role", value: "Lead", icon: ShieldCheck, color: "text-green-400" },
  { label: "Coding Club", category: "Club", value: "Contributor", icon: Users, color: "text-purple-400" },
];

export default function CampusFootprint() {
  return (
    <div className="glass-l2 p-6 rounded-3xl border border-border/50 space-y-6">
      <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
        <Award className="size-4 text-primary" /> Campus Footprint
      </h2>

      <div className="grid grid-cols-1 gap-3">
        {DEMO_FOOTPRINT.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: -4 }}
            className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border/50 group cursor-pointer transition-all motion-fast hover:border-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors", item.color as string)}>
                {React.createElement(item.icon, { className: "size-4", "aria-hidden": "true" })}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">{item.label}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{item.category}</span>
              </div>
            </div>
            <span className="text-[10px] font-black text-muted-foreground group-hover:text-primary transition-colors uppercase">
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


