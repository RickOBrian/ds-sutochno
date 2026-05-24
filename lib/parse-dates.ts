const RU_MONTHS: Record<string, number> = {
  янв: 0,
  январ: 0,
  января: 0,
  фев: 1,
  февр: 1,
  февраля: 1,
  мар: 2,
  март: 2,
  марта: 2,
  апр: 3,
  апрел: 3,
  апреля: 3,
  май: 4,
  мая: 4,
  июн: 5,
  июня: 5,
  июл: 6,
  июля: 6,
  авг: 7,
  август: 7,
  августа: 7,
  сен: 8,
  сент: 8,
  сентября: 8,
  окт: 9,
  октябр: 9,
  октября: 9,
  ноя: 10,
  нояб: 10,
  ноября: 10,
  дек: 11,
  декабр: 11,
  декабря: 11,
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function parseRussianDate(value: string): Date | null {
  const match = /^(\d{1,2})\s+([а-яё]+)\s+(\d{4})$/i.exec(value.trim());
  if (!match) return null;

  const day = Number.parseInt(match[1], 10);
  const monthKey = match[2].toLowerCase();
  const year = Number.parseInt(match[3], 10);

  const month = Object.entries(RU_MONTHS).find(([key]) => monthKey.startsWith(key))?.[1];
  if (month === undefined) return null;

  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

/** DD.MM.YYYY, MM/DD/YYYY, русские месяцы, ISO */
export function parseFlexibleDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const dotMatch = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(trimmed);
  if (dotMatch) {
    const day = Number.parseInt(dotMatch[1], 10);
    const month = Number.parseInt(dotMatch[2], 10) - 1;
    const year = Number.parseInt(dotMatch[3], 10);
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }
    return null;
  }

  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (slashMatch) {
    const month = Number.parseInt(slashMatch[1], 10) - 1;
    const day = Number.parseInt(slashMatch[2], 10);
    const year = Number.parseInt(slashMatch[3], 10);
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }
    return null;
  }

  const russian = parseRussianDate(trimmed);
  if (russian) return russian;

  const iso = new Date(trimmed);
  if (!Number.isNaN(iso.getTime())) return iso;

  return null;
}

export function toTimelineStart(date: Date): Date {
  return startOfDay(date);
}

export function toTimelineEnd(date: Date): Date {
  return endOfDay(date);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatTimelineLabel(date: Date, mode: "week" | "month"): string {
  if (mode === "month") {
    return new Intl.DateTimeFormat("ru-RU", { month: "short", year: "2-digit" }).format(date);
  }
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(date);
}

const dayMonthFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});

/** Диапазон «Начало — Конец» из таблицы для подписи столбца */
export function formatTimelineDateRange(start: Date, end: Date): string {
  const from = dayMonthFormatter.format(start);
  const to = dayMonthFormatter.format(end);

  if (from === to) return from;

  return `${from} — ${to}`;
}
