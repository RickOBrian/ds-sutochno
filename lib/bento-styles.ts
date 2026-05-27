/** Shared visual tokens — theme-aware via CSS variables in globals.css */
export const bento = {
  card: "rounded-[2rem] bg-[var(--surface)] p-8 shadow-[var(--shadow-float)]",
  cardCompact:
    "rounded-2xl bg-[var(--surface)] p-3.5 shadow-[var(--shadow-float)] sm:rounded-[1.75rem] sm:p-5 lg:rounded-[2rem] lg:p-8",
  cardHover:
    "transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]",
  cardDark:
    "rounded-[2rem] bg-[var(--hero-bg)] p-8 text-[var(--hero-fg)] shadow-[var(--hero-shadow)] ring-1 ring-[var(--hero-ring)]",
  cardDarkCompact:
    "rounded-2xl bg-[var(--hero-bg)] p-3.5 text-[var(--hero-fg)] shadow-[var(--hero-shadow)] ring-1 ring-[var(--hero-ring)] sm:rounded-[1.75rem] sm:p-5 lg:rounded-[2rem] lg:p-8",
  cardApproved:
    "rounded-xl bg-[var(--lime-deep)] p-2.5 text-zinc-900 shadow-[0_12px_40px_rgba(184,224,48,0.35)] dark:shadow-[0_12px_40px_rgba(184,224,48,0.22)] sm:rounded-2xl sm:p-3 lg:rounded-[2rem] lg:p-8",
  approvedLabel: "text-xs font-normal tracking-wide text-zinc-800/75",
  approvedMetric: "text-zinc-900",
  approvedShareBadge:
    "inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-900",
  label: "text-xs font-normal tracking-wide text-[var(--ink-faint)]",
  metric: "text-5xl font-extralight tracking-tight md:text-6xl",
  metricCompact:
    "text-2xl font-extralight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
  metricHeroCompact:
    "text-3xl font-extralight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl",
  statusCard:
    "rounded-xl bg-[var(--surface)] p-2.5 shadow-[var(--shadow-float)] ring-1 ring-[var(--border-subtle)] sm:rounded-2xl sm:p-3 lg:rounded-[2rem] lg:p-8 dark:ring-[var(--border-subtle)]",
  statusMetricInline:
    "text-xl font-extralight tabular-nums tracking-tight text-[var(--ink)]",
  statusMetricBento: "text-5xl font-extralight tracking-tight md:text-6xl",
  titleMobile:
    "text-2xl font-extralight tracking-tight text-[var(--ink)] sm:text-3xl md:text-5xl",
  title: "text-3xl font-extralight tracking-tight text-[var(--ink)] md:text-5xl",
  pillActive:
    "rounded-full bg-[var(--pill-active-bg)] px-4 py-2 text-sm font-normal text-[var(--pill-active-fg)] shadow-sm",
  pillIdle:
    "rounded-full px-4 py-2 text-sm font-normal text-[var(--ink-muted)] transition hover:text-[var(--ink)]",
  iconBtn:
    "flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface)]/80 text-[var(--ink-muted)] backdrop-blur-md transition hover:border-[var(--border-strong)] hover:text-[var(--ink)]",
  limeBadge:
    "inline-flex items-center rounded-full bg-[var(--lime)] px-2.5 py-0.5 text-xs font-medium text-zinc-900",
  surface: "bg-[var(--surface)]",
  surfaceMuted: "bg-[var(--surface-muted)]",
  ink: "text-[var(--ink)]",
  inkMuted: "text-[var(--ink-muted)]",
  inkFaint: "text-[var(--ink-faint)]",
  btnPrimary:
    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[var(--btn-primary-bg)] px-5 text-sm font-normal text-[var(--btn-primary-fg)] transition-colors hover:bg-[var(--btn-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60",
} as const;
