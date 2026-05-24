import type { ComponentRow } from "@/types/component-row";
import {
  EMPTY_STATUS_KEY,
  getStatusTheme,
  normalizeStatusKey,
  type StatusTheme,
} from "@/lib/status-config";

export interface StatusMetric {
  key: string;
  label: string;
  count: number;
  share: number;
  theme: StatusTheme;
}

export interface PlatformMetrics {
  total: number;
  statuses: StatusMetric[];
}

/** Статусы только из данных таблицы — без заготовок из конфига */
export function calculatePlatformMetrics(rows: ComponentRow[]): PlatformMetrics {
  const counts = new Map<string, { count: number; label: string }>();

  for (const row of rows) {
    const raw = row.grooming.trim();
    const key = normalizeStatusKey(raw);
    const existing = counts.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, {
        count: 1,
        label: key === EMPTY_STATUS_KEY ? getStatusTheme(EMPTY_STATUS_KEY).label : raw,
      });
    }
  }

  const total = rows.length;

  const statuses: StatusMetric[] = [...counts.entries()]
    .map(([key, { count, label }]) => {
      const theme = getStatusTheme(key, label);
      return {
        key,
        label: theme.label || label,
        count,
        share: total > 0 ? Math.round((count / total) * 100) : 0,
        theme,
      };
    })
    .sort((a, b) => {
      const orderDiff = a.theme.sortOrder - b.theme.sortOrder;
      if (orderDiff !== 0) return orderDiff;
      return b.count - a.count;
    });

  return { total, statuses };
}
