"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatTileProps {
  label: string;
  value: string;
  meta?: string;
  index: number;
}

interface TelemetryData {
  rank: string;
  level: string | number;
  streak: number;
  credits: string;
}

const StatTile = ({ label, value, meta, index }: StatTileProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="glass-l2 p-4 rounded-2xl border border-border/50 flex flex-col justify-center items-center text-center space-y-1 transition-all motion-fast hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
  >
    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
    <span className="text-xl font-black text-foreground font-mono leading-none">{value}</span>
    {meta && <span className="text-[10px] text-muted-foreground font-medium">{meta}</span>}
  </motion.div>
);

export default function TelemetryGrid({ data }: { data: TelemetryData }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      <StatTile label="SQUAD RANK" value={data.rank} meta="Diamond IV" index={0} />
      <StatTile label="SYSTEM LEVEL" value={String(data.level)} meta="EXP: 1840" index={1} />
      <StatTile label="STREAK" value={`${data.streak} Days`} meta="Global Top 5%" index={2} />
      <StatTile label="TOTAL CREDITS" value={data.credits} meta="Cumulated" index={3} />
      <StatTile label="IDENTITY CORE" value="V2.4" meta="Stable" index={4} />
    </div>
  );
}
