import type { Platform } from "@/lib/csv-sources";
import { CSV_URLS, SHEET_HTML_URLS } from "@/lib/csv-sources";
import { fetchAndParseCsv } from "@/lib/parse-csv";
import { fetchAndParseSheetHtml } from "@/lib/parse-sheet-html";
import type { ComponentRow } from "@/types/component-row";

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function mergeRows(csvRows: ComponentRow[], htmlRows: ComponentRow[]): ComponentRow[] {
  const linksByName = new Map(
    htmlRows.map((row) => [normalizeName(row.componentName), row]),
  );

  return csvRows.map((row) => {
    const htmlRow = linksByName.get(normalizeName(row.componentName));
    if (!htmlRow) return row;

    return {
      ...row,
      componentNameUrl: htmlRow.componentNameUrl,
      groomingThreadUrl: htmlRow.groomingThreadUrl,
      taskLinkUrl: htmlRow.taskLinkUrl,
    };
  });
}

export async function fetchPlatformData(platform: Platform): Promise<ComponentRow[]> {
  const [csvRows, htmlRows] = await Promise.all([
    fetchAndParseCsv(CSV_URLS[platform]),
    fetchAndParseSheetHtml(SHEET_HTML_URLS[platform]).catch(() => [] as ComponentRow[]),
  ]);

  if (csvRows.length === 0) return htmlRows;
  if (htmlRows.length === 0) return csvRows;

  return mergeRows(csvRows, htmlRows);
}
