import type { ComponentRow, DataColumnKey, TableColumnDef } from "@/types/component-row";

export function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

interface ColumnDefinition {
  key: DataColumnKey;
  defaultLabel: string;
  kind: TableColumnDef["kind"];
  hrefKey?: keyof ComponentRow;
  title?: boolean;
  brand?: "figma";
  match: (normalized: string) => boolean;
}

const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  {
    key: "componentName",
    defaultLabel: "Компонент",
    kind: "link",
    hrefKey: "componentNameUrl",
    title: true,
    brand: "figma",
    match: (h) => h === "название компонента",
  },
  {
    key: "groomingThread",
    defaultLabel: "Тред",
    kind: "link",
    hrefKey: "groomingThreadUrl",
    match: (h) => h.includes("тред") && h.includes("грумминг"),
  },
  {
    key: "grooming",
    defaultLabel: "Статус",
    kind: "badge",
    match: (h) => h === "грумминг",
  },
  {
    key: "taskLink",
    defaultLabel: "Задача",
    kind: "link",
    hrefKey: "taskLinkUrl",
    match: (h) => h.includes("ссылка") && h.includes("задач"),
  },
  {
    key: "assignee",
    defaultLabel: "Исполнитель",
    kind: "text",
    match: (h) => h === "исполнитель",
  },
  {
    key: "planDate",
    defaultLabel: "План",
    kind: "text",
    match: (h) => h.includes("план") && h.includes("дата"),
  },
];

function findColumnDefinition(normalized: string): ColumnDefinition | undefined {
  return COLUMN_DEFINITIONS.find((def) => def.match(normalized));
}

/** Колонки в порядке заголовков листа — только те, что есть в таблице */
export function resolveColumnsFromHeaders(headers: string[]): TableColumnDef[] {
  const used = new Set<DataColumnKey>();
  const columns: TableColumnDef[] = [];

  for (const header of headers) {
    const normalized = normalizeHeader(header ?? "");
    if (!normalized) continue;

    const def = findColumnDefinition(normalized);
    if (!def || used.has(def.key)) continue;

    used.add(def.key);
    columns.push({
      key: def.key,
      label: header.trim() || def.defaultLabel,
      kind: def.kind,
      hrefKey: def.hrefKey,
      title: def.title,
      brand: def.brand,
    });
  }

  return columns;
}

export function buildColumnIndexMap(
  headers: string[],
): Partial<Record<DataColumnKey, number>> {
  const map: Partial<Record<DataColumnKey, number>> = {};

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header ?? "");
    if (!normalized) return;

    const def = findColumnDefinition(normalized);
    if (!def || map[def.key] !== undefined) return;

    map[def.key] = index;
  });

  return map;
}

export function findHeaderRowIndex(rows: string[][]): number {
  return rows.findIndex((row) =>
    row.some((cell) => normalizeHeader(cell ?? "") === "название компонента"),
  );
}

export function mapRowFromCells(
  cells: string[],
  columnIndex: Partial<Record<DataColumnKey, number>>,
): ComponentRow | null {
  const get = (key: DataColumnKey) => {
    const index = columnIndex[key];
    return index !== undefined ? (cells[index] ?? "").trim() : "";
  };

  const componentName = get("componentName");
  if (!componentName) return null;

  const row: ComponentRow = { componentName };

  const grooming = get("grooming");
  if (columnIndex.grooming !== undefined) row.grooming = grooming;

  const groomingThread = get("groomingThread");
  if (columnIndex.groomingThread !== undefined) row.groomingThread = groomingThread;

  const taskLink = get("taskLink");
  if (columnIndex.taskLink !== undefined) row.taskLink = taskLink;

  const assignee = get("assignee");
  if (columnIndex.assignee !== undefined) row.assignee = assignee;

  const planDate = get("planDate");
  if (columnIndex.planDate !== undefined) row.planDate = planDate;

  return row;
}

/** Поля карточки на мобиле — все колонки кроме названия и статуса (они в шапке карточки) */
export function getCardColumns(columns: TableColumnDef[]): TableColumnDef[] {
  return columns.filter((col) => col.key !== "componentName" && col.key !== "grooming");
}
