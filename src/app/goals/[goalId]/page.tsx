import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { getGoalById, getGoalTone } from "@/lib/app-data";

type GoalDetailPageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

export default async function GoalDetailPage({
  params,
}: GoalDetailPageProps) {
  const { goalId } = await params;
  const goal = getGoalById(goalId);

  if (!goal) {
    notFound();
  }

  return (
    <AppShell
      activeHref="/goals"
      title={goal.title}
      description="Goal detail keeps target, pace, and update history together so planning and progress stay tied to the same operating rhythm."
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard eyebrow="Goal Detail" title="Progress Snapshot">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={getGoalTone(goal.status)}>
              {goal.status}
            </StatusBadge>
            <StatusBadge>{goal.owner}</StatusBadge>
          </div>
          <p className="mt-5 text-base leading-8 text-[var(--panel-muted)]">
            {goal.summary}
          </p>
          <div className="info-grid mt-5">
            <div className="info-cell">
              <p className="kicker text-[var(--accent-strong)]">Target</p>
              <p className="mt-2 text-[var(--ink)]">{goal.target}</p>
            </div>
            <div className="info-cell">
              <p className="kicker text-[var(--accent-strong)]">Progress</p>
              <p className="mt-2 text-[var(--ink)]">{goal.progress}</p>
            </div>
            <div className="info-cell">
              <p className="kicker text-[var(--accent-strong)]">Horizon</p>
              <p className="mt-2 text-[var(--ink)]">{goal.horizon}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Next Live Step" title="Goal APIs" className="metric-slab">
          <ul className="space-y-3 text-sm leading-7 text-[var(--panel-muted)]">
            <li>POST /api/goals creates the goal</li>
            <li>PATCH /api/goals/[goalId] updates status and metadata</li>
            <li>POST /api/goals/[goalId]/updates records progress</li>
          </ul>
        </SectionCard>

        <SectionCard
          eyebrow="History"
          title="Latest Updates"
          className="xl:col-span-2"
        >
          <div className="space-y-4">
            {goal.updates.map((update) => (
              <div key={update.id} className="feed-strip p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{update.author}</p>
                    <p className="mt-1 text-sm text-[var(--panel-muted)]">
                      {update.metricLabel}
                    </p>
                  </div>
                  <p className="kicker text-[var(--accent-soft)]">
                    {update.createdLabel}
                  </p>
                </div>
                <div className="data-rule mt-3" />
                <p className="mt-3 text-sm leading-7 text-[var(--panel-muted)]">
                  {update.summary}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
