import type { OrderStatus } from "../data/dashboard";
import { cx } from "../lib/format";

const styles: Record<OrderStatus, string> = {
  Paid: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Refunded: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  Failed: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[status])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
