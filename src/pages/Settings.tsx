import { useState, type FormEvent, type ReactNode } from "react";
import { Card, PageHeader, buttonClass } from "../components/Card";
import { Icon } from "../components/Icon";
import { app } from "../data/dashboard";
import { useTitle } from "../lib/useTitle";

const input = "h-10 w-full rounded-xl border border-line bg-panel px-3 text-sm placeholder:text-muted focus:border-brand focus:outline-none";

function Field({ label, id, hint, children }: { label: string; id: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Switch({ id, label, description, defaultOn }: { id: string; label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(Boolean(defaultOn));
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <p id={`${id}-label`} className="text-sm font-semibold">
          {label}
        </p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={`${id}-label`}
        onClick={() => setOn(!on)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-brand" : "bg-line"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left] ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export function Settings() {
  useTitle("Settings");
  const [saved, setSaved] = useState<string | null>(null);

  function save(section: string) {
    return (e: FormEvent) => {
      e.preventDefault();
      setSaved(section);
      window.setTimeout(() => setSaved(null), 2600);
    };
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, workspace and notifications." />

      <div className="grid max-w-4xl gap-4">
        <Card title="Profile" subtitle="How you appear to your team">
          <form onSubmit={save("Profile")} className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" id="name">
              <input id="name" className={input} defaultValue={app.user.name} autoComplete="name" required />
            </Field>
            <Field label="Email" id="email">
              <input id="email" type="email" className={input} defaultValue={app.user.email} autoComplete="email" required />
            </Field>
            <Field label="Role" id="role">
              <input id="role" className={input} defaultValue={app.user.role} />
            </Field>
            <Field label="Time zone" id="tz">
              <select id="tz" className={input} defaultValue="America/Chicago">
                <option value="America/Los_Angeles">Pacific Time (US and Canada)</option>
                <option value="America/Denver">Mountain Time (US and Canada)</option>
                <option value="America/Chicago">Central Time (US and Canada)</option>
                <option value="America/New_York">Eastern Time (US and Canada)</option>
                <option value="Europe/London">London</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Bio" id="bio" hint="A sentence or two. Shown on your team profile.">
                <textarea id="bio" rows={3} className={`${input} h-auto py-2`} defaultValue="Runs growth and billing at Brightloop." />
              </Field>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <button type="submit" className={buttonClass.primary}>
                Save profile
              </button>
            </div>
          </form>
        </Card>

        <Card title="Workspace" subtitle="Settings that apply to everyone">
          <form onSubmit={save("Workspace")} className="grid gap-5 sm:grid-cols-2">
            <Field label="Workspace name" id="ws">
              <input id="ws" className={input} defaultValue={app.workspace} required />
            </Field>
            <Field label="Currency" id="currency" hint="Used for every chart and report.">
              <select id="currency" className={input} defaultValue="USD">
                <option value="USD">US dollar (USD)</option>
                <option value="CAD">Canadian dollar (CAD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British pound (GBP)</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={buttonClass.primary}>
                Save workspace
              </button>
            </div>
          </form>
        </Card>

        <Card title="Notifications" subtitle="Choose what lands in your inbox">
          <div className="divide-y divide-line">
            <Switch id="n-orders" label="New orders" description="An email for every new paid order." defaultOn />
            <Switch id="n-failed" label="Failed payments" description="Know straight away when a card is declined." defaultOn />
            <Switch id="n-weekly" label="Weekly summary" description="Revenue, sign-ups and churn every Monday morning." />
          </div>
        </Card>

        <Card title="Danger zone" className="border-rose-500/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Delete workspace</p>
              <p className="text-sm text-muted">Removes every order, customer and report. This can't be undone.</p>
            </div>
            <button type="button" className="inline-flex h-10 items-center justify-center rounded-xl border border-rose-500/40 px-4 text-sm font-semibold text-down transition hover:bg-rose-500/10">
              Delete workspace
            </button>
          </div>
        </Card>
      </div>

      <div aria-live="polite" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
        {saved && (
          <p className="flex items-center gap-2 rounded-xl bg-fg px-4 py-3 text-sm font-medium text-canvas shadow-xl">
            <Icon name="check" className="size-4" />
            {saved} saved in this demo. Connect your API to keep changes.
          </p>
        )}
      </div>
    </>
  );
}
