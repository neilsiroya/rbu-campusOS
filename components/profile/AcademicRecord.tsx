"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, GraduationCap } from "lucide-react";

interface AcademicRecordProps {
  data: {
    gpa: string;
    progress: number;
    creditsEarned: string;
  };
}

export default function AcademicRecord({ data }: AcademicRecordProps) {
  return (
    <div className="glass-l2 p-6 rounded-3xl border border-border/50 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <GraduationCap className="size-4 text-primary" /> Academic Record
        </h2>
        <div className="flex items-center gap-1 text-success">
          <TrendingUp className="size-3" />
          <span className="text-[10px] font-bold">+0.2 This Sem</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-border/50">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cumulative GPA</span>
            <div className="text-3xl font-black text-foreground leading-none">{data.gpa}</div>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Degree Progress</span>
            <div className="text-lg font-black text-primary leading-none">{data.progress}%</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Credit Accumulation</span>
            <span className="text-xs font-mono font-bold text-foreground">{data.creditsEarned}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.progress}%` }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
