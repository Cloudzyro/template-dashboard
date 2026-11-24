import type { ReactNode } from "react";
import { cx } from "../lib/format";

export function Card({ title, subtitle, action, children, className, flush }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string; flush?: boolean }) {
  return (
    <section className={cx("rounded-2xl border border-line bg-panel", !flush && "p-5 sm:p-6", flush && "overflow-hidden", className)}>
      {(title || action) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export const buttonClass = {
  primary: "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-fg px-4 text-sm font-semibold text-canvas transition hover:opacity-90 disabled:opacity-50",
  secondary: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-panel px-4 text-sm font-semibold transition hover:bg-panel-2 disabled:opacity-50",
};
