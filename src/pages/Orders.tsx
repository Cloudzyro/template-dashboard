import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Card, PageHeader, buttonClass } from "../components/Card";
import { Icon } from "../components/Icon";
import { StatusBadge } from "../components/StatusBadge";
import { orders, type Order, type OrderStatus } from "../data/dashboard";
import { cx, formatCurrency, formatDate } from "../lib/format";
import { useTitle } from "../lib/useTitle";

type SortKey = "id" | "customer" | "plan" | "amount" | "status" | "date";
const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "id", label: "Order", className: "hidden sm:table-cell" },
  { key: "customer", label: "Customer" },
  { key: "plan", label: "Plan", className: "hidden md:table-cell" },
  { key: "date", label: "Date", className: "hidden sm:table-cell" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Amount", className: "text-right" },
];
const statuses: ("All" | OrderStatus)[] = ["All", "Paid", "Pending", "Refunded", "Failed"];

function toCsv(rows: Order[]) {
  const head = ["id", "customer", "email", "company", "plan", "seats", "amount", "status", "date", "country"];
  const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  return [head.join(","), ...rows.map((r) => head.map((h) => esc(r[h as keyof Order])).join(","))].join("\n");
}

function download(rows: Order[]) {
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function Orders() {
  useTitle("Orders");
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "date", dir: -1 });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => status === "All" || o.status === status)
      .filter((o) => !q || `${o.id} ${o.customer} ${o.email} ${o.company} ${o.plan}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
      });
  }, [query, status, sort]);

  useEffect(() => setPage(0), [query, status, pageSize]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someOnPage = rows.some((r) => selected.has(r.id));

  const headerBox = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headerBox.current) headerBox.current.indeterminate = someOnPage && !allOnPage;
  }, [someOnPage, allOnPage]);

  function toggleAll() {
    const next = new Set(selected);
    rows.forEach((r) => (allOnPage ? next.delete(r.id) : next.add(r.id)));
    setSelected(next);
  }
  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }
  function sortBy(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "date" || key === "amount" ? -1 : 1 }));
  }

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${orders.length} orders in the sample data. Click a row to see its details.`}
        actions={
          <button type="button" className={buttonClass.secondary} onClick={() => download(filtered)}>
            <Icon name="download" className="size-4" />
            Export CSV
          </button>
        }
      />

      <Card flush>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-72">
            <label htmlFor="orders-filter" className="sr-only">
              Filter orders
            </label>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" className="size-4" />
            </span>
            <input
              id="orders-filter"
              value={query}
              onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
              placeholder="Filter by name, email or order"
              className="h-10 w-full rounded-xl border border-line bg-panel pl-9 pr-3 text-sm placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>
          <div role="group" aria-label="Filter by status" className="flex gap-1 overflow-x-auto rounded-xl bg-panel-2 p-1">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={cx("shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition", status === s ? "bg-panel text-fg shadow-sm" : "text-muted hover:text-fg")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-brand-soft px-4 py-2.5 text-sm" role="status">
            <span className="font-semibold">{selected.size} selected</span>
            <div className="flex gap-2">
              <button type="button" className="rounded-lg px-3 py-1.5 font-semibold text-brand hover:bg-panel" onClick={() => download(orders.filter((o) => selected.has(o.id)))}>
                Export selected
              </button>
              <button type="button" className="rounded-lg px-3 py-1.5 font-medium text-muted hover:bg-panel hover:text-fg" onClick={() => setSelected(new Set())}>
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-panel-2 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="w-10 py-3 pl-4 pr-1">
                  <input ref={headerBox} type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Select all orders on this page" className="size-4 accent-[var(--brand)]" />
                </th>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={cx("px-2 py-3 sm:px-3 font-semibold", c.className)}
                    aria-sort={sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                  >
                    <button type="button" onClick={() => sortBy(c.key)} className={cx("inline-flex items-center gap-1 uppercase hover:text-fg", c.key === "amount" && "flex-row-reverse")}>
                      {c.label}
                      <Icon name={sort.key === c.key ? (sort.dir === 1 ? "chevron-up" : "chevron-down") : "sort"} className={cx("size-3.5", sort.key !== c.key && "opacity-40")} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((o) => (
                <tr
                  key={o.id}
                  className={cx("cursor-pointer transition hover:bg-panel-2", selected.has(o.id) && "bg-brand-soft/60")}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("input, a, button")) return;
                    navigate(`/orders/${o.id}`);
                  }}
                >
                  <td className="py-3 pl-4 pr-1">
                    <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggle(o.id)} aria-label={`Select order ${o.id}`} className="size-4 accent-[var(--brand)]" />
                  </td>
                  <td className="mono hidden px-2 py-3 sm:px-3 font-medium sm:table-cell">
                    <Link to={`/orders/${o.id}`} className="hover:text-brand hover:underline">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-2 py-3 sm:px-3">
                    <p className="font-semibold">{o.customer}</p>
                    <p className="text-xs text-muted">
                      <span className="sm:hidden">{o.id}</span>
                      <span className="hidden sm:inline">{o.company}</span>
                    </p>
                  </td>
                  <td className="hidden px-2 py-3 sm:px-3 md:table-cell">{o.plan}</td>
                  <td className="hidden whitespace-nowrap px-2 py-3 sm:px-3 text-muted sm:table-cell">{formatDate(o.date)}</td>
                  <td className="px-2 py-3 sm:px-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="num px-2 py-3 sm:px-3 pr-4 text-right font-semibold">{formatCurrency(o.amount)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted">
                    No orders match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-line p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-muted">
            <label htmlFor="page-size">Rows per page</label>
            <select id="page-size" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="h-9 rounded-lg border border-line bg-panel px-2 text-fg">
              {[10, 20, 50].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-muted">
              {filtered.length === 0 ? 0 : page * pageSize + 1} to {Math.min(filtered.length, (page + 1) * pageSize)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page === 0} className="grid size-9 place-items-center rounded-lg border border-line bg-panel disabled:opacity-40" aria-label="Previous page">
                <Icon name="chevron-left" className="size-4" />
              </button>
              <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= pages - 1} className="grid size-9 place-items-center rounded-lg border border-line bg-panel disabled:opacity-40" aria-label="Next page">
                <Icon name="chevron-right" className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
