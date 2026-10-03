"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cpu } from "lucide-react";

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
  const router = useRouter();
  // Extract category from title (e.g., "Academic Hub" -> "ACADEMICS")
  const category = title.split(" ")[1] || "SYSTEM";

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="glass-panel rounded-3xl border border-border/50 overflow-hidden relative">
          {/* System Header */}
          <div className="p-4 border-b border-border/50 bg-background/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                System / {category}
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-12 text-center space-y-8 relative">
            <div className="mx-auto size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
              <Cpu className="size-10" />
              <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-pulse" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
                {title}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-8 bg-border" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Subsystem Ready</span>
                <span className="h-[1px] w-8 bg-border" />
              </div>
              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="rounded-full px-8 h-10 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
                onClick={() => router.push("/dashboard")}
              >
                Return to Command Center
              </Button>
            </div>
          </div>

          {/* Decorative Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
               style={{ backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
