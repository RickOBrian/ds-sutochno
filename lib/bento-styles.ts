/** Shared visual tokens inspired by airy Bento / analytics references */
export const bento = {
  card: "rounded-[2rem] bg-white p-8 shadow-[var(--shadow-float)]",
  cardCompact:
    "rounded-2xl bg-white p-3.5 shadow-[var(--shadow-float)] sm:rounded-[1.75rem] sm:p-5 lg:rounded-[2rem] lg:p-8",
  cardHover:
    "transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]",
  cardDark: "rounded-[2rem] bg-zinc-950 p-8 text-white shadow-[0_12px_48px_rgba(0,0,0,0.12)]",
  cardDarkCompact:
    "rounded-2xl bg-zinc-950 p-3.5 text-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] sm:rounded-[1.75rem] sm:p-5 lg:rounded-[2rem] lg:p-8",
  label: "text-xs font-normal tracking-wide text-zinc-400",
  metric: "text-5xl font-extralight tracking-tight md:text-6xl",
  metricCompact:
    "text-2xl font-extralight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
  metricHeroCompact:
    "text-3xl font-extralight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl",
  /** Компактные карточки статусов — отдельно от hero */
  statusCard:
    "rounded-xl bg-white p-2.5 shadow-[var(--shadow-float)] sm:rounded-2xl sm:p-3 lg:rounded-[2rem] lg:p-8",
  statusMetricInline: "text-xl font-extralight tabular-nums tracking-tight text-zinc-900",
  statusMetricBento: "text-5xl font-extralight tracking-tight md:text-6xl",
  titleMobile: "text-2xl font-extralight tracking-tight text-zinc-900 sm:text-3xl md:text-5xl",
  title: "text-3xl font-extralight tracking-tight text-zinc-900 md:text-5xl",
  pillActive: "rounded-full bg-zinc-900 px-4 py-2 text-sm font-normal text-white shadow-sm",
  pillIdle: "rounded-full px-4 py-2 text-sm font-normal text-zinc-500 transition hover:text-zinc-800",
  iconBtn:
    "flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/80 text-zinc-600 backdrop-blur-md transition hover:border-zinc-300 hover:text-zinc-900",
  limeBadge:
    "inline-flex items-center rounded-full bg-[var(--lime)] px-2.5 py-0.5 text-xs font-medium text-zinc-900",
} as const;
