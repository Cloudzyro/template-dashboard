import type { OrderStatus } from "../data/dashboard";
import { cx } from "../lib/format";

// Status as quiet text with a small dot. The dot carries the color, the word stays readable.
const dots: Record<OrderStatus, string> = {
  Paid: "bg-up",
  Pending: "bg-amber-500",
  Refunded: "bg-muted/60",
  Failed: "bg-down",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] text-muted">
      <span className={cx("size-1.5 rounded-full", dots[status])} aria-hidden="true" />
      <span className={status === "Failed" ? "text-down" : undefined}>{status}</span>
    </span>
  );
}
