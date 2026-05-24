const MOSCOW_TZ = "Europe/Moscow";
const MSK_OFFSET = "+03:00";

export interface MoscowWeekBounds {
  weekStart: Date;
  weekEnd: Date;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function parseMoscowDateString(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

function moscowInstant(
  year: number,
  month: number,
  day: number,
  endOfDay = false,
): Date {
  const date = `${year}-${pad2(month)}-${pad2(day)}`;
  return new Date(`${date}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}${MSK_OFFSET}`);
}

function addCalendarDays(year: number, month: number, day: number, deltaDays: number) {
  const shifted = new Date(Date.UTC(year, month - 1, day + deltaDays));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function getMoscowWeekday(reference: Date): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: MOSCOW_TZ,
    weekday: "short",
  }).format(reference);

  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  return map[weekday] ?? 1;
}

/** Календарная неделя: понедельник 00:00 — воскресенье 23:59:59.999 (Москва) */
export function getMoscowCalendarWeekBounds(reference = new Date()): MoscowWeekBounds {
  const dateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: MOSCOW_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(reference);

  const today = parseMoscowDateString(dateStr);
  const weekday = getMoscowWeekday(reference);
  const daysSinceMonday = weekday - 1;

  const monday = addCalendarDays(today.year, today.month, today.day, -daysSinceMonday);
  const sunday = addCalendarDays(monday.year, monday.month, monday.day, 6);

  return {
    weekStart: moscowInstant(monday.year, monday.month, monday.day, false),
    weekEnd: moscowInstant(sunday.year, sunday.month, sunday.day, true),
  };
}

export function taskOverlapsWeek(
  taskStart: Date,
  taskEnd: Date,
  week: MoscowWeekBounds,
): boolean {
  return (
    taskStart.getTime() <= week.weekEnd.getTime() &&
    taskEnd.getTime() >= week.weekStart.getTime()
  );
}

export function countTasksOnMoscowWeek<T extends { start: Date; end: Date }>(
  tasks: T[],
  reference = new Date(),
): number {
  const week = getMoscowCalendarWeekBounds(reference);
  return tasks.filter((task) => taskOverlapsWeek(task.start, task.end, week)).length;
}
