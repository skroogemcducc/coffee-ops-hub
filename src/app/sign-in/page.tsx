import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-8">
      <SectionCard eyebrow="Owner Login" title="Sign in to open the board" className="w-full">
        <form action="/control-board" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="kicker text-[var(--accent)]">Email</span>
              <input
                type="email"
                name="email"
                defaultValue="owner@coffeeops.local"
                className="mt-2 w-full rounded-xl border border-[var(--panel-line)] bg-white/80 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[rgba(191,95,44,0.24)]"
              />
            </label>

            <label className="block">
              <span className="kicker text-[var(--accent)]">PIN</span>
              <input
                type="password"
                name="pin"
                defaultValue="0000"
                className="mt-2 w-full rounded-xl border border-[var(--panel-line)] bg-white/80 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[rgba(191,95,44,0.24)]"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="warn">Placeholder login</StatusBadge>
            <StatusBadge tone="accent">Clerk wiring comes next</StatusBadge>
          </div>

          <p className="text-sm leading-7 text-[var(--panel-muted)]">
            This is the login-first entry point for now. Once Clerk is wired,
            this screen can swap to the real auth flow without changing the app
            structure behind it.
          </p>

          <button type="submit" className="action-link border-0">
            Enter control board
          </button>
        </form>
      </SectionCard>
    </main>
  );
}
