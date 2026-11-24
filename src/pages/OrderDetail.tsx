import { Link, useParams } from "react-router";
import { Card, PageHeader, buttonClass } from "../components/Card";
import { Icon } from "../components/Icon";
import { StatusBadge } from "../components/StatusBadge";
import { orders } from "../data/dashboard";
import { formatCurrency, formatDate } from "../lib/format";
import { useTitle } from "../lib/useTitle";
import { NotFound } from "./NotFound";

export function OrderDetail() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);
  useTitle(order ? `Order ${order.id}` : "Order not found");
  if (!order) return <NotFound />;

  const unit = order.plan === "Enterprise" ? order.amount : order.amount / order.seats;
  const tax = Math.round(order.amount * 0.08 * 100) / 100;
  const timeline = [
    { label: "Order created", detail: `${order.customer} chose the ${order.plan} plan`, done: true },
    { label: "Payment", detail: order.status === "Failed" ? "Card was declined" : order.status === "Pending" ? "Waiting for the bank" : "Charged to card ending 4242", done: order.status !== "Pending" },
    { label: "Receipt sent", detail: order.email, done: order.status === "Paid" || order.status === "Refunded" },
    ...(order.status === "Refunded" ? [{ label: "Refunded", detail: "Full amount returned", done: true }] : []),
  ];

  return (
    <>
      <Link to="/orders" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-fg">
        <Icon name="back" className="size-4" />
        All orders
      </Link>
      <PageHeader
        title={`Order ${order.id}`}
        description={`Placed on ${formatDate(order.date)}`}
        actions={
          <>
            <a href={`mailto:${order.email}`} className={buttonClass.secondary}>
              <Icon name="mail" className="size-4" />
              Email customer
            </a>
            <button type="button" className={buttonClass.primary} disabled={order.status !== "Paid"}>
              Issue refund
            </button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card title="Summary" action={<StatusBadge status={order.status} />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th scope="col" className="pb-3 font-semibold">
                      Item
                    </th>
                    <th scope="col" className="pb-3 text-right font-semibold">
                      Qty
                    </th>
                    <th scope="col" className="pb-3 text-right font-semibold">
                      Price
                    </th>
                    <th scope="col" className="pb-3 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line">
                    <td className="py-3">
                      <p className="font-semibold">{order.plan} plan</p>
                      <p className="text-xs text-muted">Monthly subscription</p>
                    </td>
                    <td className="num py-3 text-right">{order.plan === "Enterprise" ? 1 : order.seats}</td>
                    <td className="num py-3 text-right">{formatCurrency(unit)}</td>
                    <td className="num py-3 text-right font-semibold">{formatCurrency(order.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="num">{formatCurrency(order.amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Sales tax (8%)</dt>
                <dd className="num">${tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd className="num">${(order.amount + tax).toFixed(2)}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Timeline">
            <ol className="relative space-y-6 border-l-2 border-line pl-6">
              {timeline.map((t) => (
                <li key={t.label} className="relative">
                  <span className={`absolute -left-[33px] top-0.5 grid size-4 place-items-center rounded-full ring-4 ring-panel ${t.done ? "bg-brand" : "bg-line"}`} aria-hidden="true" />
                  <p className="text-sm font-semibold">
                    {t.label}
                    {!t.done && <span className="ml-2 text-xs font-normal text-muted">Waiting</span>}
                  </p>
                  <p className="text-sm text-muted">{t.detail}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Customer">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-soft font-bold text-brand">
                {order.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{order.customer}</p>
                <p className="truncate text-sm text-muted">{order.email}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["Company", order.company],
                ["Country", order.country],
                ["Seats", String(order.seats)],
                ["Plan", order.plan],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card title="Notes">
            <label htmlFor="note" className="sr-only">
              Add a note
            </label>
            <textarea id="note" rows={4} placeholder="Add a private note about this order" className="w-full rounded-xl border border-line bg-panel-2 p-3 text-sm placeholder:text-muted focus:border-brand focus:outline-none" />
            <p className="mt-2 text-xs text-muted">Notes aren't saved in this template. Connect your own API to keep them.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
