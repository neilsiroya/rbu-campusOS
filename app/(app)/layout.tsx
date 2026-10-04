import AppShell from "@/components/layout/AppShell";
import { ViewTransitionProvider } from "@/components/layout/ViewTransitionProvider";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-full" />}>
      <ViewTransitionProvider>
        <AppShell>{children}</AppShell>
      </ViewTransitionProvider>
    </Suspense>
  );
}
