import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { UserNameDisplay, UserNameSettings } from "@/components/user-name";

export default function AccountPage() {
  return (
    <AppShell
      activeHref="/account"
      title="Account"
      description="Keep your personal identity simple and visible so the shared workspace always shows who is signed in."
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard eyebrow="Profile" title="Display name">
          <UserNameSettings />
        </SectionCard>

        <SectionCard eyebrow="Preview" title="Top bar identity">
          <div className="space-y-4">
            <div className="feed-strip p-4">
              <p className="kicker text-[var(--accent-strong)]">Signed in as</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">
                <UserNameDisplay />
              </p>
              <div className="data-rule mt-4" />
              <p className="mt-4 text-sm leading-7 text-[var(--panel-muted)]">
                This name appears in the universal top bar and links back here.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
