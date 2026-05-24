export interface RoadmapBarStyle {
  categoryKey: string;
  categoryLabel: string;
  barClass: string;
  textClass: string;
  legendClass: string;
}

const DEFAULT_STYLE: RoadmapBarStyle = {
  categoryKey: "default",
  categoryLabel: "Другое",
  barClass: "bg-zinc-100/90 ring-1 ring-zinc-200/60",
  textClass: "text-zinc-700",
  legendClass: "bg-zinc-200 ring-1 ring-zinc-200/80",
};

const TASK_TYPE_STYLES: Record<string, RoadmapBarStyle> = {
  мобильные: {
    categoryKey: "мобильные",
    categoryLabel: "Мобильные",
    barClass: "bg-violet-100/90 ring-1 ring-violet-200/50",
    textClass: "text-violet-800",
    legendClass: "bg-violet-100 ring-1 ring-violet-200/60",
  },
  токены: {
    categoryKey: "токены",
    categoryLabel: "Токены",
    barClass: "bg-amber-100/90 ring-1 ring-amber-200/50",
    textClass: "text-amber-900",
    legendClass: "bg-amber-100 ring-1 ring-amber-200/60",
  },
  процессы: {
    categoryKey: "процессы",
    categoryLabel: "Процессы",
    barClass: "bg-zinc-100/90 ring-1 ring-zinc-200/60",
    textClass: "text-zinc-600",
    legendClass: "bg-zinc-100 ring-1 ring-zinc-200/80",
  },
  веб: {
    categoryKey: "веб",
    categoryLabel: "Веб",
    barClass: "bg-sky-100/90 ring-1 ring-sky-200/50",
    textClass: "text-sky-800",
    legendClass: "bg-sky-100 ring-1 ring-sky-200/60",
  },
  web: {
    categoryKey: "веб",
    categoryLabel: "Веб",
    barClass: "bg-sky-100/90 ring-1 ring-sky-200/50",
    textClass: "text-sky-800",
    legendClass: "bg-sky-100 ring-1 ring-sky-200/60",
  },
};

const NAMED_STYLES: Record<string, RoadmapBarStyle> = {
  violet: TASK_TYPE_STYLES.мобильные,
  purple: TASK_TYPE_STYLES.мобильные,
  amber: TASK_TYPE_STYLES.токены,
  orange: TASK_TYPE_STYLES.токены,
  slate: TASK_TYPE_STYLES.процессы,
  zinc: DEFAULT_STYLE,
  gray: DEFAULT_STYLE,
  grey: DEFAULT_STYLE,
  sky: TASK_TYPE_STYLES.веб,
  blue: TASK_TYPE_STYLES.веб,
};

function capitalizeLabel(value: string): string {
  if (!value) return DEFAULT_STYLE.categoryLabel;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function resolveBarStyle(raw: string, fallbackType?: string): RoadmapBarStyle {
  const value = raw.trim().toLowerCase();
  const type = (fallbackType ?? raw).trim().toLowerCase();
  const displayLabel = raw.trim() || fallbackType?.trim() || "";

  if (value && TASK_TYPE_STYLES[value]) {
    return { ...TASK_TYPE_STYLES[value], categoryLabel: capitalizeLabel(displayLabel) };
  }
  if (type && TASK_TYPE_STYLES[type]) {
    return {
      ...TASK_TYPE_STYLES[type],
      categoryLabel: capitalizeLabel(displayLabel || TASK_TYPE_STYLES[type].categoryLabel),
    };
  }
  if (value && NAMED_STYLES[value]) {
    return { ...NAMED_STYLES[value], categoryLabel: capitalizeLabel(displayLabel) };
  }

  if (displayLabel) {
    return {
      ...DEFAULT_STYLE,
      categoryKey: displayLabel.toLowerCase(),
      categoryLabel: capitalizeLabel(displayLabel),
    };
  }

  return DEFAULT_STYLE;
}

export function collectLegendItems(tasks: { style: RoadmapBarStyle }[]): RoadmapBarStyle[] {
  const map = new Map<string, RoadmapBarStyle>();

  for (const task of tasks) {
    if (!map.has(task.style.categoryKey)) {
      map.set(task.style.categoryKey, task.style);
    }
  }

  return [...map.values()].sort((a, b) =>
    a.categoryLabel.localeCompare(b.categoryLabel, "ru"),
  );
}
