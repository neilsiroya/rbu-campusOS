import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { BrandMark } from "@/components/os/BrandMark";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Off Campus — RBU CampusOS",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <BrandMark href="/" showTagline />

      <p className="mt-14 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        404 · Off Campus
      </p>
      <h1 className="mt-4 max-w-xl font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        This corner of the campus hasn&apos;t been built yet.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        The route you followed doesn&apos;t map to a CampusOS surface. Return to
        your dashboard, or explore the campus map to find where you need to be.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button
          render={<Link href="/dashboard" />}
          size="lg"
          className="h-11 rounded-full px-6"
        >
          <Home className="size-4" aria-hidden="true" />
          Back to Dashboard
        </Button>
        <Button
          render={<Link href="/map" />}
          variant="outline"
          size="lg"
          className="h-11 rounded-full px-6"
        >
          <Compass className="size-4" aria-hidden="true" />
          Open Campus Map
        </Button>
      </div>

      <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
        RBU CampusOS · One Campus. One Identity. Every Experience.
      </p>
    </main>
  );
}
