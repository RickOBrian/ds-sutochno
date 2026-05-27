import type { Platform } from "@/lib/csv-sources";
import { CSV_URLS, SHEET_HTML_URLS } from "@/lib/csv-sources";
import { fetchAndParseCsv } from "@/lib/parse-csv";
import { fetchAndParseSheetHtml } from "@/lib/parse-sheet-html";
import type { ComponentRow, PlatformSheetData } from "@/types/component-row";

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
      groomingColor: htmlRow.groomingColor ?? row.groomingColor,
    };
  });
}

const EMPTY_SHEET: PlatformSheetData = { rows: [], columns: [] };

export async function fetchPlatformData(platform: Platform): Promise<PlatformSheetData> {
  const [csvData, htmlData] = await Promise.all([
    fetchAndParseCsv(CSV_URLS[platform]),
    fetchAndParseSheetHtml(SHEET_HTML_URLS[platform]).catch(() => EMPTY_SHEET),
  ]);

  if (csvData.rows.length === 0 && htmlData.rows.length === 0) {
    return { rows: [], columns: csvData.columns.length > 0 ? csvData.columns : htmlData.columns };
  }

  if (csvData.rows.length === 0) {
    return htmlData;
  }

  if (htmlData.rows.length === 0) {
    return csvData;
  }

  return {
    rows: mergeRows(csvData.rows, htmlData.rows),
    columns: csvData.columns,
  };
}
