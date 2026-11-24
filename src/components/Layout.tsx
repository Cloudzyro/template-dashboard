import { useEffect, useState, type FormEvent } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { app, nav, navSecondary } from "../data/dashboard";
import { cx } from "../lib/format";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const link = ({ isActive }: { isActive: boolean }) =>
    cx(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
      isActive ? "bg-rail-2 text-white shadow-[inset_2px_0_0_var(--color-lime)]" : "text-zinc-400 hover:bg-rail-2/60 hover:text-white",
    );
  return (
    <div className="flex h-full flex-col bg-rail px-4 py-5 text-white">
      <div className="flex items-center gap-2.5 px-2">
        <svg viewBox="0 0 64 64" className="size-8" aria-hidden="true">
          <rect width="64" height="64" rx="16" fill="#1c2027" />
          <circle cx="32" cy="32" r="15" fill="none" stroke="#c8f560" strokeWidth="7" />
          <circle cx="44" cy="20" r="6" fill="#7c6cff" />
        </svg>
        <div>
          <p className="text-[15px] font-bold leading-tight">{app.name}</p>
          <p className="text-xs text-zinc-400">{app.tagline}</p>
        </div>
      </div>

      <nav aria-label="Main" className="mt-8">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Workspace</p>
        <ul className="space-y-1">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === "/"} className={link} onClick={onNavigate}>
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <p className="px-3 pb-2 pt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Screens</p>
        <ul className="space-y-1">
          {navSecondary.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={link} onClick={onNavigate}>
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto rounded-2xl border border-rail-line bg-rail-2 p-4">
        <p className="text-sm font-semibold">Sample data</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">Every number here comes from src/data/dashboard.ts. Swap it for your own API.</p>
      </div>
    </div>
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
    navigate(q ? `/orders?q=${encodeURIComponent(q)}` : "/orders");
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[264px_1fr]">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-canvas">
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-dvh lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[min(288px,85vw)] shadow-2xl">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-5 grid size-9 place-items-center rounded-lg text-zinc-400 hover:bg-rail-2 hover:text-white" aria-label="Close menu">
              <Icon name="close" />
            </button>
          </div>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur">
          <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl text-muted hover:bg-panel-2 hover:text-fg lg:hidden" aria-label="Open menu" aria-expanded={open}>
              <Icon name="menu" />
            </button>
            <form role="search" onSubmit={onSearch} className="relative min-w-0 flex-1 sm:max-w-sm">
              <label htmlFor="global-search" className="sr-only">
                Search orders
              </label>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Icon name="search" className="size-4" />
              </span>
              <input id="global-search" name="q" placeholder="Search orders" className="h-10 w-full rounded-xl border border-line bg-panel pl-9 pr-3 text-sm placeholder:text-muted focus:border-brand focus:outline-none" />
            </form>
            <div className="ml-auto flex items-center gap-1">
              <button type="button" className="relative grid size-10 place-items-center rounded-xl text-muted transition hover:bg-panel-2 hover:text-fg" aria-label="Notifications, 3 unread">
                <Icon name="bell" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand ring-2 ring-canvas" aria-hidden="true" />
              </button>
              <ThemeToggle />
              <NavLink to="/settings" className="ml-1 flex items-center gap-2.5 rounded-xl p-1 pr-1 transition hover:bg-panel-2 sm:pr-3" aria-label={`Account settings for ${app.user.name}`}>
                <span className="grid size-8 place-items-center rounded-lg bg-brand text-xs font-bold text-white dark:text-rail">{app.user.initials}</span>
                <span className="hidden text-left text-sm leading-tight sm:block">
                  <span className="block font-semibold">{app.user.name}</span>
                  <span className="block text-xs text-muted">{app.workspace}</span>
                </span>
              </NavLink>
            </div>
          </div>
        </header>
        <main id="content" className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
