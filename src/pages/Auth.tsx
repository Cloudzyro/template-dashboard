// Sign-in and sign-up screens. These are UI only: they don't create accounts or
// check passwords. Connect your own auth provider (for example Supabase Auth,
// Clerk, Auth.js or your own API) in the onSubmit handlers below.
import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { ThemeToggle } from "../components/ThemeToggle";
import { app, kpis, months, revenue } from "../data/dashboard";
import { formatCurrency } from "../lib/format";
import { useTitle } from "../lib/useTitle";

const input = "h-11 w-full rounded-lg border border-line bg-panel px-3 text-sm placeholder:text-muted focus:border-brand focus:outline-none";

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-semibold">
            <svg viewBox="0 0 64 64" className="size-8" aria-hidden="true">
              <rect width="64" height="64" rx="16" fill="#0f1115" />
              <circle cx="32" cy="32" r="15" fill="none" stroke="#c8f560" strokeWidth="7" />
            </svg>
            {app.name}
          </Link>
          <ThemeToggle />
        </div>

        <main id="content" className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div className="mb-8 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm" role="note">
            <Icon name="info" className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" />
            <p>
              <span className="font-medium">Screen only.</span> This form doesn&apos;t sign anyone in. Connect your own auth provider before you use it.
            </p>
          </div>
          <h1 className="text-[28px] font-medium tracking-[-0.01em]">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-muted">{footer}</p>
        </main>
      </div>

      <div className="hidden flex-col items-center justify-center bg-rail p-12 text-white lg:flex" aria-hidden="true">
        <RevenuePreview />
      </div>
    </div>
  );
}

// The year's recurring revenue from the sample data, drawn as one line that ends
// on the current month with the lime loop from the logo.
function RevenuePreview() {
  const values = revenue.thisYear;
  const w = 520;
  const h = 200;
  const min = Math.min(...values) * 0.9;
  const max = Math.max(...values);
  const x = (i: number) => 8 + (i / (values.length - 1)) * (w - 16);
  const y = (v: number) => 8 + (1 - (v - min) / (max - min)) * (h - 16);
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  const last = values.length - 1;
  return (
    <div className="w-full max-w-[520px] rounded-2xl border border-rail-line bg-rail-2 p-8">
      <p className="text-sm text-zinc-400">Monthly recurring revenue</p>
      <p className="num mt-3 text-5xl font-medium tracking-[-0.02em]">{formatCurrency(values[last])}</p>
      <p className="mt-3 text-sm text-zinc-400">
        <span className="num text-lime">+{kpis[0].change}%</span> vs last month
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-8 w-full">
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" x2={w} y1={8 + (i / 3) * (h - 16)} y2={8 + (i / 3) * (h - 16)} stroke="#262a32" />
        ))}
        <path d={line} fill="none" stroke="#c8f560" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(last)} cy={y(values[last])} r="6" fill="#181b21" stroke="#c8f560" strokeWidth="3" />
      </svg>
      <div className="mt-3 flex justify-between font-mono text-[11px] text-zinc-500">
        <span>{months[0]}</span>
        <span>{months[last]}</span>
      </div>
    </div>
  );
}

function useDemoSubmit() {
  const [message, setMessage] = useState<string | null>(null);
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Replace this with a call to your auth provider.
    setMessage("Nothing was sent. Connect an auth provider in src/pages/Auth.tsx to make this work.");
  }
  return { message, onSubmit };
}

export function SignIn() {
  useTitle("Sign in");
  const { message, onSubmit } = useDemoSubmit();
  return (
    <AuthShell
      title={`Sign in to ${app.name}`}
      subtitle="Revenue, subscribers and orders in one place"
      footer={
        <>
          New here?{" "}
          <Link to="/sign-up" className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="si-email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input id="si-email" type="email" autoComplete="email" required placeholder="you@company.com" className={input} />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="si-password" className="text-sm font-medium">
              Password
            </label>
            <a href="#/sign-in" className="text-sm text-brand hover:underline">
              Forgot password?
            </a>
          </div>
          <input id="si-password" type="password" autoComplete="current-password" required className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-[var(--brand)]" /> Keep me signed in
        </label>
        <button type="submit" className="h-11 w-full rounded-lg bg-fg text-sm font-medium text-canvas transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]">
          Sign in
        </button>
        {message && (
          <p role="status" className="rounded-lg bg-panel-2 p-3 text-sm text-muted">
            {message}
          </p>
        )}
      </form>
    </AuthShell>
  );
}

export function SignUp() {
  useTitle("Create an account");
  const { message, onSubmit } = useDemoSubmit();
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking recurring revenue for your workspace"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="su-first" className="mb-2 block text-sm font-medium">
              First name
            </label>
            <input id="su-first" autoComplete="given-name" required className={input} />
          </div>
          <div>
            <label htmlFor="su-last" className="mb-2 block text-sm font-medium">
              Last name
            </label>
            <input id="su-last" autoComplete="family-name" required className={input} />
          </div>
        </div>
        <div>
          <label htmlFor="su-email" className="mb-2 block text-sm font-medium">
            Work email
          </label>
          <input id="su-email" type="email" autoComplete="email" required placeholder="you@company.com" className={input} />
        </div>
        <div>
          <label htmlFor="su-password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <input id="su-password" type="password" autoComplete="new-password" minLength={10} required className={input} aria-describedby="su-password-hint" />
          <p id="su-password-hint" className="mt-1.5 text-xs text-muted">
            At least 10 characters
          </p>
        </div>
        <button type="submit" className="h-11 w-full rounded-lg bg-fg text-sm font-medium text-canvas transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]">
          Create account
        </button>
        {message && (
          <p role="status" className="rounded-lg bg-panel-2 p-3 text-sm text-muted">
            {message}
          </p>
        )}
      </form>
    </AuthShell>
  );
}
