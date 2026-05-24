import Papa from "papaparse";
import type { ComponentRow } from "@/types/component-row";

type ColumnKey = keyof ComponentRow;

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function headerMatchesColumn(normalized: string, key: ColumnKey): boolean {
  switch (key) {
    case "componentName":
      return normalized === "название компонента";
    case "groomingThread":
      return normalized.includes("тред") && normalized.includes("грумминг");
    case "grooming":
      return normalized === "грумминг";
    case "taskLink":
      return normalized.includes("ссылка") && normalized.includes("задач");
    case "assignee":
      return normalized === "исполнитель";
    case "planDate":
      return normalized.includes("план") && normalized.includes("дата");
    default:
      return false;
  }
}

const DATA_COLUMN_KEYS: ColumnKey[] = [
  "componentName",
  "groomingThread",
  "grooming",
  "taskLink",
  "assignee",
  "planDate",
];

function buildColumnIndexMap(headers: string[]): Partial<Record<ColumnKey, number>> {
  const map: Partial<Record<ColumnKey, number>> = {};

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    if (!normalized) return;

    for (const key of DATA_COLUMN_KEYS) {
      if (map[key] !== undefined) continue;
      if (headerMatchesColumn(normalized, key)) {
        map[key] = index;
      }
    }
  });

  return map;
}

function mapRow(row: string[], columnIndex: Partial<Record<ColumnKey, number>>): ComponentRow {
  const get = (key: ColumnKey) => {
    const index = columnIndex[key];
    return index !== undefined ? (row[index] ?? "").trim() : "";
  };

  return {
    componentName: get("componentName"),
    groomingThread: get("groomingThread"),
    grooming: get("grooming"),
    taskLink: get("taskLink"),
    assignee: get("assignee"),
    planDate: get("planDate"),
  };
}

export function parseComponentsCsv(csvText: string): ComponentRow[] {
  if (!csvText.trim()) return [];

  const { data, errors } = Papa.parse<string[]>(csvText, {
    skipEmptyLines: false,
  });

  if (errors.length > 0) {
    console.warn("CSV parse warnings:", errors);
  }

  const rows = data as string[][];
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => normalizeHeader(cell ?? "") === "название компонента"),
  );

  if (headerIndex === -1) return [];

  const columnIndex = buildColumnIndexMap(rows[headerIndex]);

  return rows
    .slice(headerIndex + 1)
    .map((row) => mapRow(row, columnIndex))
    .filter((row) => row.componentName.length > 0);
}

export async function fetchAndParseCsv(url: string): Promise<ComponentRow[]> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить данные (${response.status})`);
  }

  const text = await response.text();
  return parseComponentsCsv(text);
}
