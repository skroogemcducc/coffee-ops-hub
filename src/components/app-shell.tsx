import { AppTopBar } from "@/components/app-top-bar";

type AppShellProps = {
  activeHref: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AppShell({
  activeHref,
  title,
  description,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen pb-10">
      <div className="mx-auto max-w-[1240px] px-4 py-4 sm:px-6">
        <AppTopBar activeHref={activeHref} detailText={title} />

        <main className="min-w-0">
          <header className="frame-shell p-5 md:p-6">
            <p className="kicker text-[var(--accent-strong)]">Daily operations</p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-[var(--ink)] md:text-4xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--panel-muted)] md:text-base">
                  {description}
                </p>
              </div>
              <p className="text-sm leading-6 text-[var(--ink-soft)] md:max-w-[240px] md:text-right">
                Same pages on desktop and phone. One navigation model.
              </p>
            </div>
          </header>

          <div className="mt-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
