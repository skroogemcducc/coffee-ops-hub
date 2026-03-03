type SectionCardProps = {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  eyebrow,
  title,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section className={`frame-shell panel-grid p-5 md:p-6 ${className}`}>
      {(eyebrow || title) && (
        <header className="mb-4">
          {eyebrow ? (
            <p className="kicker mb-2 text-[var(--accent)]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-2xl font-semibold text-[var(--ink)]">{title}</h2>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
