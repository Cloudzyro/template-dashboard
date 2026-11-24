import type { Kpi } from "../data/dashboard";
import { cx, formatValue } from "../lib/format";
import { Sparkline } from "./charts";

export function KpiCard({ kpi, goodWhenDown = false }: { kpi: Kpi; goodWhenDown?: boolean }) {
  const good = goodWhenDown ? kpi.change < 0 : kpi.change > 0;
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-panel p-5">
      <p className="text-sm font-medium text-muted">{kpi.label}</p>
      <p className="num mt-2 text-[30px] font-bold leading-none tracking-tight">{formatValue(kpi.value, kpi.format)}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className={cx("shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold", good ? "bg-emerald-500/12 text-up" : "bg-rose-500/12 text-down")}>
          <span className="sr-only">{kpi.change > 0 ? "Up" : "Down"} </span>
          {kpi.change > 0 ? "+" : ""}
          {kpi.change}
          {kpi.format === "percent" ? " pts" : "%"}
          <span className="font-normal text-muted"> vs last month</span>
        </p>
        <div className="w-24">
          <Sparkline values={kpi.spark} color={good ? "var(--up)" : "var(--down)"} />
        </div>
      </div>
    </div>
  );
}
