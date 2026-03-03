import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getGoalTone, goals } from "@/lib/app-data";

export default function GoalsPage() {
  return (
    <AppShell
      activeHref="/goals"
      title="Goals"
      description="Goals live in the same operating surface as tasks so strategy and execution do not split into separate systems."
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard eyebrow="Shared Targets" title="Current Goals">
          <div className="space-y-4">
            {goals.map((goal) => (
              <Link key={goal.id} href={`/goals/${goal.id}`} className="frame-link p-5">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone={getGoalTone(goal.status)}>
                    {goal.status}
                  </StatusBadge>
                  <StatusBadge>{goal.owner}</StatusBadge>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-[var(--ink)]">
                  {goal.title}
                </h2>
                <div className="data-rule mt-4" />
                <p className="mt-4 text-sm leading-7 text-[var(--panel-muted)]">
                  {goal.summary}
                </p>
                <div className="info-grid mt-4 sm:grid-cols-2">
                  <div className="info-cell">
                    <p className="kicker text-[var(--accent-strong)]">Target</p>
                    <p className="mt-2 text-[var(--ink)]">{goal.target}</p>
                  </div>
                  <div className="info-cell">
                    <p className="kicker text-[var(--accent-strong)]">Pace</p>
                    <p className="mt-2 text-[var(--ink)]">{goal.progress}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard eyebrow="V1 Focus" title="What Ships First" className="metric-slab">
          <div className="space-y-4 text-sm leading-7 text-[var(--panel-muted)]">
            <p>
              Goal creation, goal detail, and update history should become the
              second complete live module after tasks.
            </p>
            <p>
              The mobile layout keeps the same hierarchy so weekly reviews and
              quick field updates feel like one product.
            </p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="accent">List</StatusBadge>
              <StatusBadge tone="good">Updates</StatusBadge>
              <StatusBadge tone="neutral">Shared visibility</StatusBadge>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
