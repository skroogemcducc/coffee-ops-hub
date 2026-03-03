type StatusTone = "neutral" | "accent" | "good" | "warn" | "alert";

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-[rgba(82,59,40,0.08)] bg-white/70 text-[var(--ink-muted)]",
  accent:
    "border-[rgba(47,118,102,0.12)] bg-[rgba(47,118,102,0.1)] text-[var(--accent-strong)]",
  good:
    "border-[rgba(47,118,102,0.12)] bg-[rgba(47,118,102,0.08)] text-[var(--accent-strong)]",
  warn:
    "border-[rgba(214,154,50,0.16)] bg-[rgba(214,154,50,0.12)] text-[#8a5b08]",
  alert:
    "border-[rgba(191,95,44,0.14)] bg-[rgba(191,95,44,0.12)] text-[var(--accent)]",
};

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusTone;
};

export function StatusBadge({
  children,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={`status-chip border text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
