// Sign-in and sign-up screens. These are UI only: they don't create accounts or
// check passwords. Connect your own auth provider (for example Supabase Auth,
// Clerk, Auth.js or your own API) in the onSubmit handlers below.
import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { ThemeToggle } from "../components/ThemeToggle";
import { app } from "../data/dashboard";
import { useTitle } from "../lib/useTitle";

const input = "h-11 w-full rounded-xl border border-line bg-panel px-3.5 text-sm placeholder:text-muted focus:border-brand focus:outline-none";

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold">
            <svg viewBox="0 0 64 64" className="size-8" aria-hidden="true">
              <rect width="64" height="64" rx="16" fill="#0f1115" />
              <circle cx="32" cy="32" r="15" fill="none" stroke="#c8f560" strokeWidth="7" />
              <circle cx="44" cy="20" r="6" fill="#7c6cff" />
            </svg>
            {app.name}
          </Link>
          <ThemeToggle />
        </div>

        <main id="content" className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div className="mb-6 flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm" role="note">
            <Icon name="info" className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" />
            <p>
              <span className="font-semibold">Screen only.</span> This form doesn&apos;t sign anyone in. Connect your own auth provider before you use it.
            </p>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-muted">{footer}</p>
        </main>
      </div>

      <div className="relative hidden overflow-hidden bg-rail lg:block" aria-hidden="true">
        <svg className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 900">
          <defs>
            <radialGradient id="glow" cx="0.7" cy="0.25" r="0.7">
              <stop offset="0" stopColor="#7c6cff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#0f1115" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="900" fill="url(#glow)" />
          <g fill="none" stroke="#c8f560" strokeOpacity="0.16">
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx="560" cy="230" r={60 + i * 70} />
            ))}
          </g>
          <circle cx="560" cy="230" r="44" fill="#c8f560" />
        </svg>
        <div className="absolute inset-x-12 bottom-12 rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime">This month</p>
          <p className="num mt-3 text-5xl font-semibold">$84,210</p>
          <p className="mt-2 text-zinc-300">Monthly recurring revenue, up 12.4% on last month.</p>
        </div>
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
      title="Welcome back"
      subtitle="Sign in to see how your business is doing."
      footer={
        <>
          New here?{" "}
          <Link to="/sign-up" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="si-email" className="mb-1.5 block text-sm font-semibold">
            Email
          </label>
          <input id="si-email" type="email" autoComplete="email" required placeholder="you@company.com" className={input} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="si-password" className="text-sm font-semibold">
              Password
            </label>
            <a href="#/sign-in" className="text-sm font-medium text-brand hover:underline">
              Forgot password?
            </a>
          </div>
          <input id="si-password" type="password" autoComplete="current-password" required className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-[var(--brand)]" /> Keep me signed in
        </label>
        <button type="submit" className="h-11 w-full rounded-xl bg-fg text-sm font-semibold text-canvas transition hover:opacity-90">
          Sign in
        </button>
        {message && (
          <p role="status" className="rounded-xl bg-panel-2 p-3 text-sm text-muted">
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
      subtitle="Start tracking revenue in a couple of minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="su-first" className="mb-1.5 block text-sm font-semibold">
              First name
            </label>
            <input id="su-first" autoComplete="given-name" required className={input} />
          </div>
          <div>
            <label htmlFor="su-last" className="mb-1.5 block text-sm font-semibold">
              Last name
            </label>
            <input id="su-last" autoComplete="family-name" required className={input} />
          </div>
        </div>
        <div>
          <label htmlFor="su-email" className="mb-1.5 block text-sm font-semibold">
            Work email
          </label>
          <input id="su-email" type="email" autoComplete="email" required placeholder="you@company.com" className={input} />
        </div>
        <div>
          <label htmlFor="su-password" className="mb-1.5 block text-sm font-semibold">
            Password
          </label>
          <input id="su-password" type="password" autoComplete="new-password" minLength={10} required className={input} aria-describedby="su-password-hint" />
          <p id="su-password-hint" className="mt-1.5 text-xs text-muted">
            At least 10 characters.
          </p>
        </div>
        <button type="submit" className="h-11 w-full rounded-xl bg-fg text-sm font-semibold text-canvas transition hover:opacity-90">
          Create account
        </button>
        {message && (
          <p role="status" className="rounded-xl bg-panel-2 p-3 text-sm text-muted">
            {message}
          </p>
        )}
      </form>
    </AuthShell>
  );
}
