import type { ReactNode } from "react";

export function PageIntro({
  kicker,
  title,
  description,
  action,
}: {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-intro flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-2">
        {kicker ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{kicker}</p>
        ) : null}
        <h1 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">{title}</h1>
        {description ? <p className="text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
