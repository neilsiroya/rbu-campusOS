"use client";

import { useState, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase";
import { getSafeReturnPath } from "@/lib/auth-redirect";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

type FormMessage = {
  tone: "error";
  text: string;
};

const subscribeToNavigation = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
};
const getReturnPath = () => getSafeReturnPath(new URLSearchParams(window.location.search).get("from"));
const getServerReturnPath = () => "/dashboard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const returnPath = useSyncExternalStore(subscribeToNavigation, getReturnPath, getServerReturnPath);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const fromPath = getSafeReturnPath(searchParams.get("from"));

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      router.replace(fromPath);
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "We couldn't sign you in. Please try again.";
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
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="text-xs font-bold tracking-widest text-primary">CampusOS</Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to stay connected with campus.</p>
        </div>

        <Card className="glass-command border-primary/20 p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">University Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                    id="login-email"
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
                <label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {message ? (
              <p
                role="alert"
                className="rounded-lg border border-danger/20 bg-danger/10 p-2 text-center text-xs font-medium text-danger"
              >
                {message.text}
              </p>
            ) : null}

            <Button
              className="h-12 w-full rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to CampusOS?{" "}
            <Link href={`/auth/signup?from=${encodeURIComponent(returnPath)}`} className="font-semibold text-primary hover:underline">Create an account</Link>
          </p>
        </Card>
        <p className="mt-6 text-center text-sm text-muted-foreground"><Link href="/" className="hover:text-primary">Back to home</Link></p>
      </motion.div>
    </div>
  );
}
