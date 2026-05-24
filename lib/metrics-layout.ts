/** Grid helpers for bento metrics — avoids holes when status count changes */

export function getDesktopMetricColumns(statusCount: number): number {
  if (statusCount <= 0) return 1;
  return 2 + statusCount;
}

/**
 * Status cards below hero on viewports below lg.
 * Never squeeze 3+ cards into one row on narrow screens — stack or use 2 cols max.
 */
/** Узкий экран — одна колонка, чтобы подписи не обрезались */
export function getStatusGridClass(statusCount: number): string {
  if (statusCount <= 1) return "grid-cols-1";
  return "grid-cols-1 min-[520px]:grid-cols-2";
}
