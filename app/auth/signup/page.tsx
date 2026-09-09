"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, GraduationCap } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

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
        setMessage("Identity created. Check your email to confirm it, then log in.");
        return;
      }
      setMessage("Identity created successfully. Redirecting...");

      // Check if we have a previous path to return to
      const searchParams = new URLSearchParams(window.location.search);
      const requestedPath = searchParams.get('from');
      const fromPath = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : '/dashboard';
      router.replace(fromPath);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Identity Gateway</h2>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Create Identity</h1>
        </div>

        <Card className="glass-command border-primary/20 p-8 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">University Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                      type="email"
                      placeholder="student@rbu.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Access Key</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Academic Branch</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                      placeholder="CSE"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Academic Year</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground font-bold text-[10px]">YR</div>
                    <Input
                      className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                      placeholder="2nd"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="h-[124px]" /> {/* Alignment spacer */}
              </div>
            </div>

            {message && (
              <p className={cn(
                "text-xs text-center font-medium p-2 rounded-lg border",
                message.includes("successfully")
                  ? "text-success bg-success/10 border-success/20"
                  : "text-danger bg-danger/10 border-danger/20"
              )}>
                {message}
              </p>
            )}

            <Button
              className="w-full h-12 text-sm font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              type="submit"
              disabled={loading}
            >
              {loading ? "Initializing Identity..." : "Create System Identity"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
