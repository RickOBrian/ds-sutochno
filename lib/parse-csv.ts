import Papa from "papaparse";
import {
  buildColumnIndexMap,
  findHeaderRowIndex,
  mapRowFromCells,
  resolveColumnsFromHeaders,
} from "@/lib/sheet-columns";
import type { ComponentRow, PlatformSheetData } from "@/types/component-row";

export function parseComponentsCsv(csvText: string): PlatformSheetData {
  if (!csvText.trim()) {
    return { rows: [], columns: [] };
  }

  const { data, errors } = Papa.parse<string[]>(csvText, {
    skipEmptyLines: false,
  });

  if (errors.length > 0) {
    console.warn("CSV parse warnings:", errors);
  }

  const rows = data as string[][];
  const headerIndex = findHeaderRowIndex(rows);

  if (headerIndex === -1) {
    return { rows: [], columns: [] };
  }

  const headers = rows[headerIndex];
  const columns = resolveColumnsFromHeaders(headers);
  const columnIndex = buildColumnIndexMap(headers);

  const parsedRows = rows
    .slice(headerIndex + 1)
    .map((row) => mapRowFromCells(row, columnIndex))
    .filter((row): row is ComponentRow => row !== null);

  return { rows: parsedRows, columns };
}

export async function fetchAndParseCsv(url: string): Promise<PlatformSheetData> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить данные (${response.status})`);
  }

  const text = await response.text();
  return parseComponentsCsv(text);
}
