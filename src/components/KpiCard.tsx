import type { Kpi } from "../data/dashboard";
import { cx, formatValue } from "../lib/format";

export function KpiCard({ kpi, goodWhenDown = false }: { kpi: Kpi; goodWhenDown?: boolean }) {
  const good = goodWhenDown ? kpi.change < 0 : kpi.change > 0;
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-panel p-4 sm:p-5">
      <p className="min-h-10 text-sm text-muted sm:min-h-0">{kpi.label}</p>
      <p className="num mt-3 text-2xl font-medium sm:text-[28px] leading-none tracking-[-0.01em]">{formatValue(kpi.value, kpi.format)}</p>
      <p className="mt-3 text-[13px] text-muted">
        <span className={cx("num font-medium", good ? "text-up" : "text-down")}>
          <span className="sr-only">{kpi.change > 0 ? "Up" : "Down"} </span>
          {kpi.change > 0 ? "+" : ""}
          {kpi.change}
          {kpi.format === "percent" ? " pts" : "%"}
        </span>{" "}
        vs last month
      </p>
    </div>
  );
}
