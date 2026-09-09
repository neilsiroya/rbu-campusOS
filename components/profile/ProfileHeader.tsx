"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    name: string;
    id: string;
    major: string;
    year: string;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 relative py-10">
      {/* Biometric Avatar Container */}
      <div className="relative">
        {/* Scanning Ring Animation */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "linear",
          }}
          className="absolute -inset-4 border-2 border-dashed border-primary/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear",
          }}
          className="absolute -inset-2 border border-primary/20 rounded-full"
        />

        {/* Main Avatar */}
        <div className="relative size-32 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 p-1 shadow-2xl shadow-primary/20">
          <div className="size-full rounded-2xl bg-background overflow-hidden flex items-center justify-center">
             <div className="size-full bg-gradient-to-br from-muted to-background flex items-center justify-center">
                <span className="text-4xl font-black text-primary/20">{user.name.charAt(0)}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Identity Metadata */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">{user.name}</h1>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-[9px] font-black uppercase tracking-widest">
            <CheckCircle2 className="size-3" />
            System Verified
          </div>
        </motion.div>
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <span className="text-xs font-mono font-bold">{user.id}</span>
          <span className="size-1 rounded-full bg-border" />
          <span className="text-xs font-medium uppercase tracking-wider">{user.major}</span>
          <span className="size-1 rounded-full bg-border" />
          <span className="text-xs font-medium uppercase tracking-wider">{user.year} Year</span>
        </div>
      </div>
    </div>
  );
}
