// All of the dashboard's text, menu items and sample data live in this file.
// Replace the sample data with calls to your own API when you're ready.

export const app = {
  name: "Brightloop",
  tagline: "Subscription analytics",
  user: { name: "Maya Okafor", email: "maya@brightloop.example", role: "Workspace owner", initials: "MO" },
  workspace: "Brightloop Studio",
};

export const nav = [
  { label: "Overview", to: "/", icon: "grid" },
  { label: "Orders", to: "/orders", icon: "receipt" },
  { label: "Settings", to: "/settings", icon: "settings" },
] as const;

export const navSecondary = [
  { label: "Sign in screen", to: "/sign-in", icon: "login" },
  { label: "Sign up screen", to: "/sign-up", icon: "user-plus" },
] as const;

export type Kpi = { label: string; value: number; format: "currency" | "number" | "percent"; change: number };

export const kpis: Kpi[] = [
  { label: "Monthly recurring revenue", value: 84210, format: "currency", change: 12.4 },
  { label: "Active subscribers", value: 3127, format: "number", change: 6.8 },
  { label: "Net revenue retention", value: 108.2, format: "percent", change: 1.9 },
  { label: "Churn rate", value: 2.1, format: "percent", change: -0.4 },
];

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const revenue = {
  thisYear: [41200, 44800, 47100, 51900, 55300, 58600, 61200, 65800, 70400, 74900, 79300, 84210],
  lastYear: [30100, 31800, 33500, 34200, 36900, 38400, 40100, 41700, 43900, 45200, 47800, 50300],
};

export const signupsByWeek = [
  { label: "W1", value: 182 },
  { label: "W2", value: 214 },
  { label: "W3", value: 198 },
  { label: "W4", value: 251 },
  { label: "W5", value: 236 },
  { label: "W6", value: 289 },
  { label: "W7", value: 274 },
  { label: "W8", value: 318 },
];

export const planMix = [
  { label: "Starter", value: 1420 },
  { label: "Growth", value: 1105 },
  { label: "Scale", value: 482 },
  { label: "Enterprise", value: 120 },
];

export const activity = [
  { who: "Lena Marsh", what: "upgraded to Scale", when: "12 minutes ago" },
  { who: "Harbor & Pine", what: "paid invoice BL-2291", when: "40 minutes ago" },
  { who: "Theo Vance", what: "started a Growth trial", when: "2 hours ago" },
  { who: "Quillbridge Co.", what: "added 6 seats", when: "Yesterday" },
  { who: "Ana Ferreira", what: "canceled Starter", when: "Yesterday" },
];

export type OrderStatus = "Paid" | "Pending" | "Refunded" | "Failed";
export type Order = {
  id: string;
  customer: string;
  email: string;
  company: string;
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  amount: number;
  status: OrderStatus;
  date: string; // YYYY-MM-DD
  country: string;
  seats: number;
};

// Sample orders, generated from fixed lists so the data is the same on every load.
const firstNames = ["Lena", "Theo", "Ana", "Jonah", "Priya", "Marcus", "Ines", "Caleb", "Yuki", "Rosa", "Felix", "Nadia", "Omar", "Greta", "Silas", "Talia", "Dev", "Wren", "Hugo", "Clara"];
const lastNames = ["Marsh", "Vance", "Ferreira", "Bellamy", "Raman", "Okoro", "Lindqvist", "Hart", "Tanaka", "Delgado", "Brandt", "Haddad", "Farouk", "Nyberg", "Crane", "Ashby", "Kapoor", "Ellison", "Moreau", "Quint"];
const companies = ["Harbor & Pine", "Quillbridge Co.", "Saltmarsh Labs", "Juniper Freight", "Oakline Studio", "Copperleaf", "Northfold", "Kitewood", "Brasswell", "Fernhollow", "Lumen Yard", "Tidewell", "Ravenmoor", "Glasshouse Goods", "Stillwater Tea"];
const plans: Order["plan"][] = ["Starter", "Growth", "Growth", "Scale", "Starter", "Enterprise"];
const prices: Record<Order["plan"], number> = { Starter: 29, Growth: 79, Scale: 199, Enterprise: 890 };
const statuses: OrderStatus[] = ["Paid", "Paid", "Paid", "Pending", "Paid", "Refunded", "Paid", "Failed"];
const countries = ["United States", "Canada", "United Kingdom", "Germany", "Australia", "Netherlands", "Japan", "Brazil"];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seeded(42);
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];

export const orders: Order[] = Array.from({ length: 64 }, (_, i) => {
  const first = pick(firstNames);
  const last = pick(lastNames);
  const plan = pick(plans);
  const seats = plan === "Starter" ? 1 : 1 + Math.floor(rand() * 12);
  const day = new Date(Date.UTC(2026, 10, 20) - i * 86400000 * (0.6 + rand() * 0.8));
  return {
    id: `BL-${2300 - i}`,
    customer: `${first} ${last}`,
    email: `${first}.${last}`.toLowerCase() + "@example.com",
    company: pick(companies),
    plan,
    seats,
    amount: prices[plan] * (plan === "Enterprise" ? 1 : seats),
    status: pick(statuses),
    date: day.toISOString().slice(0, 10),
    country: pick(countries),
  };
});
