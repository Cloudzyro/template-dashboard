const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US");

export function formatValue(value: number, kind: "currency" | "number" | "percent") {
  if (kind === "currency") return currency.format(value);
  if (kind === "percent") return `${value.toFixed(1)}%`;
  return number.format(value);
}

export const formatCurrency = (v: number) => currency.format(v);
export const formatNumber = (v: number) => number.format(v);

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
