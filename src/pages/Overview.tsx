import { Link } from "react-router";
import { Card, PageHeader, buttonClass } from "../components/Card";
import { AreaChart, BarChart, ShareList } from "../components/charts";
import { Icon } from "../components/Icon";
import { KpiCard } from "../components/KpiCard";
import { StatusBadge } from "../components/StatusBadge";
import { activity, app, kpis, months, orders, planMix, revenue, signupsByWeek } from "../data/dashboard";
import { formatCurrency, formatDate, formatNumber } from "../lib/format";
import { useTitle } from "../lib/useTitle";

const compactCurrency = (v: number) => (v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`);

export function Overview() {
  useTitle("Overview");
  const totalSubs = planMix.reduce((s, p) => s + p.value, 0);

  return (
    <>
      <PageHeader
        title="Overview"
        description={`${app.workspace}, recurring revenue and subscribers for 2026`}
        actions={
          <>
            <label className="sr-only" htmlFor="range">
              Date range
            </label>
            <select id="range" className="h-10 rounded-lg border border-line bg-panel px-3 text-sm" defaultValue="12m">
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
            <button type="button" className={buttonClass.primary}>
              <Icon name="download" className="size-4" />
              Export
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} kpi={k} goodWhenDown={k.label === "Churn rate"} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Revenue"
          subtitle="Monthly recurring revenue, this year against last"
          action={
            <div className="text-right">
              <p className="num text-2xl font-medium leading-none tracking-[-0.01em]">{formatCurrency(revenue.thisYear[revenue.thisYear.length - 1])}</p>
              <div className="mt-2 hidden items-center justify-end gap-4 font-mono text-xs text-muted sm:flex">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-4 rounded bg-[var(--chart-1)]" />
                  2026
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-4 border-t-2 border-dashed border-[var(--chart-muted)]" />
                  2025
                </span>
              </div>
            </div>
          }
        >
          <AreaChart
            labels={months}
            format={compactCurrency}
            series={[
              { name: "2025", values: revenue.lastYear, color: "var(--chart-muted)", dashed: true },
              { name: "2026", values: revenue.thisYear, color: "var(--chart-1)", fill: true },
            ]}
          />
        </Card>
        <Card title="Plan mix" subtitle="Active subscribers by plan">
          <p className="num text-2xl font-medium leading-none tracking-[-0.01em]">{formatNumber(totalSubs)}</p>
          <p className="mt-2 text-sm text-muted">subscribers across {planMix.length} plans</p>
          <div className="mt-6 border-t border-line pt-6">
            <ShareList data={planMix} format={formatNumber} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="New sign-ups" subtitle="Per week, last 8 weeks">
          <BarChart data={signupsByWeek} />
        </Card>
        <Card title="Recent activity" subtitle="Across your workspace">
          <ol className="space-y-4">
            {activity.map((a) => (
              <li key={a.who + a.what} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--chart-muted)]" aria-hidden="true" />
                <div className="text-sm">
                  <p>
                    <span className="font-medium">{a.who}</span> <span className="text-muted">{a.what}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted">{a.when}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
        <Card
          title="Latest orders"
          action={
            <Link to="/orders" className="text-sm font-medium text-brand hover:underline">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <Link to={`/orders/${o.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors duration-150 hover:bg-panel-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{o.customer}</p>
                    <p className="font-mono text-xs text-muted">
                      {o.id} &middot; {formatDate(o.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="num text-sm font-medium">{formatCurrency(o.amount)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
