export function DemoNotice({ children }: { children?: string }) {
  return (
    <p data-notice="info" className="rounded-lg border border-border/80 bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
      {children ?? "Demo campus data for product development. Not live university records."}
    </p>
  );
}
