/** Ключи колонок, которые умеет отображать дашборд */
export type DataColumnKey =
  | "componentName"
  | "groomingThread"
  | "grooming"
  | "taskLink"
  | "assignee"
  | "planDate";

export interface ComponentRow {
  componentName: string;
  componentNameUrl?: string;
  groomingThread?: string;
  groomingThreadUrl?: string;
  grooming?: string;
  groomingColor?: string;
  taskLink?: string;
  taskLinkUrl?: string;
  assignee?: string;
  planDate?: string;
}

export type TableColumnKind = "link" | "badge" | "text";

export interface TableColumnDef {
  key: DataColumnKey;
  /** Подпись из заголовка таблицы */
  label: string;
  kind: TableColumnKind;
  hrefKey?: keyof ComponentRow;
  title?: boolean;
  brand?: "figma";
}

export interface PlatformSheetData {
  rows: ComponentRow[];
  columns: TableColumnDef[];
}
