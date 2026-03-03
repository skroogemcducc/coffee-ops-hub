import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { activityEntries } from "@/lib/app-data";

export default function ActivityPage() {
  return (
    <AppShell
      activeHref="/activity"
      title="Recent Activity"
      description="A clean event stream for what changed last. It is designed to scan quickly in one pass, especially on a phone."
    >
      <SectionCard eyebrow="Feed" title="What Changed">
        <div className="space-y-4">
          {activityEntries.map((entry) => (
            <div key={entry.id} className="feed-strip p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone="accent">{entry.entityType}</StatusBadge>
                  <StatusBadge>{entry.actor}</StatusBadge>
                </div>
                <p className="kicker text-[var(--accent-soft)]">{entry.when}</p>
              </div>
              <div className="data-rule mt-4" />
              <p className="mt-4 text-lg font-semibold text-[var(--ink)]">
                {entry.action}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--panel-muted)]">
                {entry.detail}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
