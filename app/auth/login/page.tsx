"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setMessage("Authenticating...");

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
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Identity Gateway</h2>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">System Login</h1>
        </div>

        <Card className="glass-command border-primary/20 p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
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

            {message && (
              <p className={cn(
                "text-xs text-center font-medium p-2 rounded-lg border",
                message.includes("Authenticating")
                  ? "text-primary bg-primary/10 border-primary/20"
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
              {loading ? "Verifying..." : "Access System"}
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
