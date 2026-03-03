import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { menuFeatures } from "@/lib/app-data";

export default function MenuPage() {
  return (
    <AppShell
      activeHref="/control-board"
      title="Menu"
      description="Keep featured items, pricing focus, and menu changes in one place."
    >
      <SectionCard eyebrow="Current focus" title="Menu notes">
        <div className="space-y-3">
          {menuFeatures.map((item) => (
            <div key={item.id} className="feed-strip p-4">
              <p className="kicker text-[var(--accent)]">{item.section}</p>
              <p className="mt-2 text-base font-semibold text-[var(--ink)]">{item.focus}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--panel-muted)]">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
