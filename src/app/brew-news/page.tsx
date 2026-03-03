import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { brewNewsItems } from "@/lib/app-data";

export default function BrewNewsPage() {
  return (
    <AppShell
      activeHref="/control-board"
      title="Brew News"
      description="Internal updates, reminders, and the small things that keep the week running smoothly."
    >
      <SectionCard eyebrow="Latest" title="News and notes">
        <div className="space-y-3">
          {brewNewsItems.map((item) => (
            <div key={item.id} className="feed-strip p-4">
              <p className="text-base font-semibold text-[var(--ink)]">
                {item.headline}
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{item.when}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--panel-muted)]">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
