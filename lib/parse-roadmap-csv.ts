import Papa from "papaparse";
import { parseFlexibleDate, toTimelineEnd, toTimelineStart } from "@/lib/parse-dates";
import { resolveBarStyle } from "@/lib/roadmap-colors";
import type { RoadmapTask } from "@/types/roadmap-task";

type RoadmapColumnKey = "title" | "assignee" | "start" | "end" | "color";

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function headerMatchesColumn(normalized: string, key: RoadmapColumnKey): boolean {
  switch (key) {
    case "title":
      return normalized === "название" || normalized.includes("назван");
    case "assignee":
      return normalized === "исполнитель" || normalized.includes("исполн");
    case "start":
      return (
        normalized === "старт" ||
        normalized === "начало" ||
        normalized.includes("start") ||
        normalized.includes("начал")
      );
    case "end":
      return (
        normalized === "финиш" ||
        normalized === "конец" ||
        normalized.includes("finish") ||
        normalized.includes("конец") ||
        normalized.includes("финиш")
      );
    case "color":
      return (
        normalized.includes("статус") ||
        normalized.includes("цвет") ||
        normalized.includes("color") ||
        normalized === "тип задачи" ||
        normalized.includes("тип")
      );
    default:
      return false;
  }
}

const COLUMN_KEYS: RoadmapColumnKey[] = ["title", "assignee", "start", "end", "color"];

function buildColumnIndexMap(headers: string[]): Partial<Record<RoadmapColumnKey, number>> {
  const map: Partial<Record<RoadmapColumnKey, number>> = {};

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    if (!normalized) return;

    for (const key of COLUMN_KEYS) {
      if (map[key] !== undefined) continue;
      if (headerMatchesColumn(normalized, key)) {
        map[key] = index;
      }
    }
  });

  return map;
}

function findHeaderRow(rows: string[][]): number {
  return rows.findIndex((row) =>
    row.some((cell) => {
      const n = normalizeHeader(cell ?? "");
      return n === "название" || n.includes("назван");
    }),
  );
}

export function parseRoadmapCsv(csvText: string): RoadmapTask[] {
  if (!csvText.trim()) return [];

  const { data, errors } = Papa.parse<string[]>(csvText, {
    skipEmptyLines: false,
  });

  if (errors.length > 0) {
    console.warn("Roadmap CSV parse warnings:", errors);
  }

  const rows = data as string[][];
  const headerIndex = findHeaderRow(rows);
  if (headerIndex === -1) return [];

  const columnIndex = buildColumnIndexMap(rows[headerIndex]);
  if (columnIndex.title === undefined || columnIndex.start === undefined || columnIndex.end === undefined) {
    return [];
  }

  const get = (row: string[], key: RoadmapColumnKey) => {
    const index = columnIndex[key];
    return index !== undefined ? (row[index] ?? "").trim() : "";
  };

  const tasks: RoadmapTask[] = [];

  rows.slice(headerIndex + 1).forEach((row, rowIndex) => {
    const title = get(row, "title");
    if (!title) return;

    const startRaw = get(row, "start");
    const endRaw = get(row, "end");
    const startParsed = parseFlexibleDate(startRaw);
    const endParsed = parseFlexibleDate(endRaw);

    if (!startParsed || !endParsed) return;

    const start = toTimelineStart(startParsed);
    const end = toTimelineEnd(endParsed);
    if (end.getTime() < start.getTime()) return;

    const assignee = get(row, "assignee");
    const colorRaw = get(row, "color");

    tasks.push({
      id: `${rowIndex}-${title}`,
      title,
      assignee,
      start,
      end,
      style: resolveBarStyle(colorRaw || assignee, colorRaw),
    });
  });

  return tasks;
}

export async function fetchAndParseRoadmapCsv(url: string): Promise<RoadmapTask[]> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить роудмап (${response.status})`);
  }

  const text = await response.text();
  return parseRoadmapCsv(text);
}
