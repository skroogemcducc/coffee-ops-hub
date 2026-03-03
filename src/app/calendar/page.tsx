import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { calendarEvents } from "@/lib/app-data";

export default function CalendarPage() {
  return (
    <AppShell
      activeHref="/calendar"
      title="Calendar"
      description="A simple calendar module for the next events, prep windows, and weekly rhythm."
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard eyebrow="Upcoming" title="This week">
          <div className="space-y-3">
            {calendarEvents.map((event) => (
              <div key={event.id} className="feed-strip p-4">
                <p className="text-base font-semibold text-[var(--ink)]">
                  {event.title}
                </p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{event.when}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--panel-muted)]">
                  {event.note}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard eyebrow="Options" title="Default views">
          <div className="space-y-3">
            <StatusBadge tone="accent">Week view</StatusBadge>
            <StatusBadge tone="good">Prep blocks</StatusBadge>
            <StatusBadge tone="neutral">Order deadlines</StatusBadge>
            <p className="pt-2 text-sm leading-7 text-[var(--panel-muted)]">
              This module is ready to grow into a fuller schedule view later,
              but the first version keeps the important upcoming events easy to
              scan.
            </p>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
