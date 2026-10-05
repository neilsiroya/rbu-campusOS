import AppShell from "@/components/layout/AppShell";
import { ViewTransitionProvider } from "@/components/layout/ViewTransitionProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // NOTE: no Suspense wrapper here on purpose. The shell subtree contains
  // no suspending hooks (no useSearchParams/usefetch), so a boundary only
  // risks parking the whole app behind a never-resolving fallback.
  // If a suspender is ever introduced, Next will fail fast at build time
  // instead of shipping a blank page.
  return (
    <ViewTransitionProvider>
      <AppShell>{children}</AppShell>
    </ViewTransitionProvider>
  );
}
