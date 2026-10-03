"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { User, Mail, Lock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

type FormMessage = {
  tone: "success" | "error";
  text: string;
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            branch: branch,
            year: year,
          },
        },
      });

      if (error) throw error;
      if (!data.session) {
        setMessage({
          tone: "success",
          text: "Identity created. Check your email to confirm it, then log in.",
        });
        return;
      }

      // Check if we have a previous path to return to
      const searchParams = new URLSearchParams(window.location.search);
      const requestedPath = searchParams.get('from');
      const fromPath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : '/dashboard';
      router.replace(fromPath);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setMessage({ tone: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Identity Gateway</h2>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Create Identity</h1>
        </div>

        <Card className="glass-command border-primary/20 p-8 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    autoComplete="name"
                    className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">University Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                    type="email"
                    placeholder="student@rbu.ac.in"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-branch" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Academic Branch</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-branch"
                    className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                    placeholder="CSE"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-year" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Academic Year</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground font-bold text-[10px]" aria-hidden="true">YR</div>
                  <Input
                    id="signup-year"
                    className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                    placeholder="2nd"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="signup-password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {message ? (
              <p
                role={message.tone === "error" ? "alert" : "status"}
                className={cn(
                  "rounded-lg border p-2 text-center text-xs font-medium",
                  message.tone === "success"
                    ? "border-success/20 bg-success/10 text-success"
                    : "border-danger/20 bg-danger/10 text-danger"
                )}
              >
                {message.text}
              </p>
            ) : null}

            <Button
              className="h-12 w-full rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating identity…" : "Create System Identity"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
