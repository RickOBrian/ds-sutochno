import {
  buildColumnIndexMap,
  normalizeHeader,
  resolveColumnsFromHeaders,
} from "@/lib/sheet-columns";
import { normalizeHref } from "@/lib/link-utils";
import type { ComponentRow, DataColumnKey, PlatformSheetData } from "@/types/component-row";

interface ParsedCell {
  text: string;
  href?: string;
  backgroundColor?: string;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseCellBackground(html: string): string | undefined {
  const match =
    html.match(/background(?:-color)?:\s*([^;"']+)/i) ||
    html.match(/bgcolor="([^"]+)"/i);

  if (!match) return undefined;

  const value = match[1].trim().toLowerCase();
  if (
    value === "#ffffff" ||
    value === "white" ||
    value === "rgb(255, 255, 255)" ||
    value === "transparent"
  ) {
    return undefined;
  }

  return value;
}

function parseCellHtml(html: string): ParsedCell {
  const linkMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, "").trim());
  const backgroundColor = parseCellBackground(html);

  if (linkMatch) {
    return {
      text: decodeHtmlEntities(linkMatch[2].replace(/<[^>]+>/g, "").trim()) || text,
      href: normalizeHref(linkMatch[1]),
      backgroundColor,
    };
  }

  return { text, backgroundColor };
}

function findHeaderRowIndex(rows: ParsedCell[][]): number {
  return rows.findIndex((row) =>
    row.some((cell) => normalizeHeader(cell.text) === "название компонента"),
  );
}

function mapRowFromParsedCells(
  cells: ParsedCell[],
  columnIndex: Partial<Record<DataColumnKey, number>>,
): ComponentRow | null {
  const get = (key: DataColumnKey) => {
    const index = columnIndex[key];
    if (index === undefined) return undefined;
    return cells[index];
  };

  const nameCell = get("componentName");
  if (!nameCell?.text.trim()) return null;

  const row: ComponentRow = {
    componentName: nameCell.text,
    componentNameUrl: nameCell.href,
  };

  const threadCell = get("groomingThread");
  if (threadCell !== undefined) {
    row.groomingThread = threadCell.text;
    row.groomingThreadUrl = threadCell.href;
  }

  const groomingCell = get("grooming");
  if (groomingCell !== undefined) {
    row.grooming = groomingCell.text;
    row.groomingColor = groomingCell.backgroundColor;
  }

  const taskCell = get("taskLink");
  if (taskCell !== undefined) {
    row.taskLink = taskCell.text;
    row.taskLinkUrl = taskCell.href;
  }

  const assigneeCell = get("assignee");
  if (assigneeCell !== undefined) {
    row.assignee = assigneeCell.text;
  }

  const planCell = get("planDate");
  if (planCell !== undefined) {
    row.planDate = planCell.text;
  }

  return row;
}

export function parseSheetHtml(html: string): PlatformSheetData {
  const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) {
    return { rows: [], columns: [] };
  }

  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const parsedRows: ParsedCell[][] = [];

  for (const rowMatch of tableMatch[1].matchAll(rowRe)) {
    const cells: ParsedCell[] = [];
    for (const cellMatch of rowMatch[1].matchAll(cellRe)) {
      cells.push(parseCellHtml(cellMatch[1]));
    }
    if (cells.length > 0) parsedRows.push(cells);
  }

  const headerIndex = findHeaderRowIndex(parsedRows);
  if (headerIndex === -1) {
    return { rows: [], columns: [] };
  }

  const headers = parsedRows[headerIndex].map((cell) => cell.text);
  const columns = resolveColumnsFromHeaders(headers);
  const columnIndex = buildColumnIndexMap(headers);

  const rows = parsedRows
    .slice(headerIndex + 1)
    .map((cells) => mapRowFromParsedCells(cells, columnIndex))
    .filter((row): row is ComponentRow => row !== null);

  return { rows, columns };
}

export async function fetchAndParseSheetHtml(url: string): Promise<PlatformSheetData> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить ссылки (${response.status})`);
  }

  const html = await response.text();
  return parseSheetHtml(html);
}
