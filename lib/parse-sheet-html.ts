import type { ComponentRow } from "@/types/component-row";
import { normalizeHref } from "@/lib/link-utils";

interface ParsedCell {
  text: string;
  href?: string;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseCellHtml(html: string): ParsedCell {
  const linkMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, "").trim());

  if (linkMatch) {
    return {
      text: decodeHtmlEntities(linkMatch[2].replace(/<[^>]+>/g, "").trim()) || text,
      href: normalizeHref(linkMatch[1]),
    };
  }

  return { text };
}

function findHeaderRowIndex(rows: ParsedCell[][]): number {
  return rows.findIndex((row) =>
    row.some((cell) => cell.text.trim().toLowerCase() === "название компонента"),
  );
}

function toComponentRow(cells: ParsedCell[]): ComponentRow | null {
  const [name, thread, grooming, task, assignee, planDate] = cells;

  if (!name?.text.trim()) return null;

  return {
    componentName: name.text,
    componentNameUrl: name.href,
    groomingThread: thread?.text ?? "",
    groomingThreadUrl: thread?.href,
    grooming: grooming?.text ?? "",
    taskLink: task?.text ?? "",
    taskLinkUrl: task?.href,
    assignee: assignee?.text ?? "",
    planDate: planDate?.text ?? "",
  };
}

export function parseSheetHtml(html: string): ComponentRow[] {
  const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return [];

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
  if (headerIndex === -1) return [];

  return parsedRows
    .slice(headerIndex + 1)
    .map(toComponentRow)
    .filter((row): row is ComponentRow => row !== null);
}

export async function fetchAndParseSheetHtml(url: string): Promise<ComponentRow[]> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить ссылки (${response.status})`);
  }

  const html = await response.text();
  return parseSheetHtml(html);
}
