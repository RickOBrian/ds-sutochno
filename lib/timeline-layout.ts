import {
  addDays,
  formatTimelineDateRange,
  formatTimelineLabel,
  toTimelineEnd,
  toTimelineStart,
} from "@/lib/parse-dates";
import type {
  RoadmapTask,
  TimelineColumn,
  TimelineLayout,
  TimelineMarker,
  TimelineRange,
  TimelineScale,
} from "@/types/roadmap-task";

const RANGE_PADDING_LEFT_DAYS = 0;
const RANGE_PADDING_RIGHT_DAYS = 6;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TRACK_TRAILING_PX = 24;

/** Плотность шкалы: при длинном роудмапе — меньше px/день, но всегда со скроллом */
export function getTimelineScale(spanDays: number): TimelineScale {
  const pxPerDay =
    spanDays > 365 ? 10 : spanDays > 180 ? 14 : spanDays > 90 ? 20 : 28;

  return {
    pxPerDay,
    trackWidthPx: Math.ceil(spanDays * pxPerDay),
  };
}

function computeRange(tasks: RoadmapTask[]): TimelineRange | null {
  if (tasks.length === 0) return null;

  let min = tasks[0].start.getTime();
  let max = tasks[0].end.getTime();

  for (const task of tasks) {
    min = Math.min(min, task.start.getTime());
    max = Math.max(max, task.end.getTime());
  }

  const minDate = toTimelineStart(addDays(new Date(min), -RANGE_PADDING_LEFT_DAYS));
  const maxDate = toTimelineEnd(addDays(new Date(max), RANGE_PADDING_RIGHT_DAYS));
  const totalMs = Math.max(maxDate.getTime() - minDate.getTime(), MS_PER_DAY);

  return {
    minDate,
    maxDate,
    totalMs,
    spanDays: totalMs / MS_PER_DAY,
  };
}

function toLeftPx(ms: number, range: TimelineRange, scale: TimelineScale): number {
  const ratio = (ms - range.minDate.getTime()) / range.totalMs;
  return ratio * scale.trackWidthPx;
}

function getColumnKey(start: Date): string {
  const day = toTimelineStart(start);
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
}

function buildColumns(
  tasks: RoadmapTask[],
  range: TimelineRange,
  scale: TimelineScale,
): TimelineColumn[] {
  const grouped = new Map<string, RoadmapTask[]>();

  for (const task of tasks) {
    const key = getColumnKey(task.start);
    const list = grouped.get(key);
    if (list) list.push(task);
    else grouped.set(key, [task]);
  }

  return [...grouped.keys()]
    .sort()
    .map((columnKey) => {
      const columnTasks = grouped
        .get(columnKey)!
        .sort(
          (a, b) =>
            a.start.getTime() - b.start.getTime() ||
            a.title.localeCompare(b.title, "ru"),
        );

      const anchorLeftPx = toLeftPx(columnTasks[0].start.getTime(), range, scale);

      let rangeStart = columnTasks[0].start;
      let rangeEnd = columnTasks[0].end;

      for (const task of columnTasks) {
        if (task.start.getTime() < rangeStart.getTime()) rangeStart = task.start;
        if (task.end.getTime() > rangeEnd.getTime()) rangeEnd = task.end;
      }

      return {
        columnKey,
        anchorLeftPx,
        dateRangeLabel: formatTimelineDateRange(rangeStart, rangeEnd),
        tasks: columnTasks.map((task) => {
          const rightPx = toLeftPx(task.end.getTime(), range, scale);
          const leftPx = toLeftPx(task.start.getTime(), range, scale);

          return {
            id: task.id,
            title: task.title,
            assignee: task.assignee,
            widthPx: Math.max(rightPx - leftPx, scale.pxPerDay * 0.35),
            style: task.style,
          };
        }),
      };
    });
}

function buildMarkers(
  range: TimelineRange,
  scale: TimelineScale,
): { markers: TimelineMarker[] } {
  const mode: "week" | "month" = range.spanDays > 120 ? "month" : "week";
  const markers: TimelineMarker[] = [];
  const cursor = new Date(range.minDate);

  if (mode === "month") {
    cursor.setDate(1);
    while (cursor.getTime() <= range.maxDate.getTime()) {
      if (cursor.getTime() >= range.minDate.getTime()) {
        markers.push({
          date: new Date(cursor),
          leftPx: toLeftPx(cursor.getTime(), range, scale),
          label: formatTimelineLabel(cursor, "month"),
        });
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }
  } else {
    const day = cursor.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    cursor.setDate(cursor.getDate() + diff);

    while (cursor.getTime() <= range.maxDate.getTime()) {
      if (cursor.getTime() >= range.minDate.getTime()) {
        markers.push({
          date: new Date(cursor),
          leftPx: toLeftPx(cursor.getTime(), range, scale),
          label: formatTimelineLabel(cursor, "week"),
        });
      }
      cursor.setDate(cursor.getDate() + 7);
    }
  }

  return { markers };
}

export function buildTimelineLayout(tasks: RoadmapTask[]): TimelineLayout | null {
  const range = computeRange(tasks);
  if (!range) return null;

  const scale = getTimelineScale(range.spanDays);
  const columns = buildColumns(tasks, range, scale);
  const { markers } = buildMarkers(range, scale);

  const contentRightPx = tasks.reduce((maxRight, task) => {
    const rightPx = toLeftPx(task.end.getTime(), range, scale);
    return Math.max(maxRight, rightPx);
  }, 0);

  const trackWidthPx = Math.max(scale.trackWidthPx, contentRightPx + TRACK_TRAILING_PX);

  const todayMs = Date.now();
  const todayLeftPx =
    todayMs >= range.minDate.getTime() && todayMs <= range.maxDate.getTime()
      ? toLeftPx(todayMs, range, scale)
      : null;

  return {
    range,
    scale: { ...scale, trackWidthPx },
    columns,
    markers,
    todayLeftPx,
  };
}
