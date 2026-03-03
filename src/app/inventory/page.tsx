import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { inventoryHighlights } from "@/lib/app-data";

export default function InventoryPage() {
  return (
    <AppShell
      activeHref="/control-board"
      title="Inventory"
      description="A quick inventory module for stock checks, low items, and the next reorder decision."
    >
      <SectionCard eyebrow="Stock check" title="What needs attention">
        <div className="space-y-3">
          {inventoryHighlights.map((item) => (
            <div key={item.id} className="feed-strip p-4">
              <p className="text-base font-semibold text-[var(--ink)]">{item.item}</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{item.stock}</p>
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
