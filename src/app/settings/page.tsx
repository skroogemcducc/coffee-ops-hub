import { AppShell } from "@/components/app-shell";
import { CompanyNameSettings } from "@/components/company-name";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";

const authConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_replace_me" &&
    process.env.CLERK_SECRET_KEY !== "sk_test_replace_me",
);

const databaseConfigured = Boolean(
  process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("postgres:postgres@localhost:5432"),
);

export default function SettingsPage() {
  return (
    <AppShell
      activeHref="/settings"
      title="Settings"
      description="Set the company name, keep the app feeling like yours, and handle the setup details in one place."
    >
      <div className="grid gap-5">
        <SectionCard eyebrow="Brand" title="Company name">
          <CompanyNameSettings />
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard eyebrow="Integration Status" title="Service Readiness">
          <div className="space-y-4">
            <div className="feed-strip p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-[var(--ink)]">Clerk Authentication</p>
                <StatusBadge tone={authConfigured ? "good" : "warn"}>
                  {authConfigured ? "configured" : "pending"}
                </StatusBadge>
              </div>
              <div className="data-rule mt-3" />
              <p className="mt-3 text-sm leading-7 text-[var(--panel-muted)]">
                Add real Clerk keys in `.env.local` to replace the placeholder
                values from `.env.example`.
              </p>
            </div>

            <div className="feed-strip p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-[var(--ink)]">PostgreSQL Database</p>
                <StatusBadge tone={databaseConfigured ? "good" : "warn"}>
                  {databaseConfigured ? "configured" : "pending"}
                </StatusBadge>
              </div>
              <div className="data-rule mt-3" />
              <p className="mt-3 text-sm leading-7 text-[var(--panel-muted)]">
                Point `DATABASE_URL` to the real project database, then run the
                first Prisma migration.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Mobile" title="Seamless Handoff Principles">
          <div className="space-y-4 text-sm leading-7 text-[var(--panel-muted)]">
            <p>
              Every V1 route uses the same URL and content model on desktop and
              phone, so there is no sync gap caused by separate mobile-only
              views.
            </p>
            <p>
              The app includes a web manifest, a fixed mobile navigation, and a
              layout that stays legible in portrait orientation.
            </p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="good">PWA-ready</StatusBadge>
              <StatusBadge tone="accent">Touch-friendly</StatusBadge>
              <StatusBadge tone="neutral">Single route model</StatusBadge>
            </div>
          </div>
        </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
