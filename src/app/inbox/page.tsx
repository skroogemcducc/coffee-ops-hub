import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";

export default function InboxPage() {
  return (
    <AppShell
      activeHref="/inbox"
      title="Inbox"
      description="A simple placeholder for chat and internal messages."
    >
      <SectionCard eyebrow="Messages" title="Latest">
        <div className="space-y-3">
          <div className="feed-strip p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-[var(--ink)]">Wife</p>
              <StatusBadge tone="accent">new</StatusBadge>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--panel-muted)]">
              Need to confirm cup counts before the Tuesday order cutoff.
            </p>
          </div>

          <div className="feed-strip p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-[var(--ink)]">System note</p>
              <StatusBadge tone="neutral">saved</StatusBadge>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--panel-muted)]">
              This route can become the full internal chat module later.
            </p>
          </div>
        </div>
      </SectionCard>
    </AppShell>
  );
}
