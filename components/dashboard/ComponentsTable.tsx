import type { ComponentRow, TableColumnDef } from "@/types/component-row";
import { bento } from "@/lib/bento-styles";
import { ComponentCards } from "./ComponentCards";
import { EmptyDash } from "./EmptyDash";
import { GroomingBadge } from "./GroomingBadge";
import { LinkCell } from "./LinkCell";

interface ComponentsTableProps {
  rows: ComponentRow[];
  columns: TableColumnDef[];
  isPlatformEmpty: boolean;
  embedded?: boolean;
}

function TextCell({ value }: { value: string | undefined }) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return <EmptyDash />;
  return <span className="text-sm font-light text-[var(--ink-muted)]">{trimmed}</span>;
}

function renderCell(row: ComponentRow, col: TableColumnDef) {
  if (col.kind === "badge") {
    return <GroomingBadge status={row.grooming ?? ""} colorHex={row.groomingColor} />;
  }

  if (col.kind === "link") {
    const value = row[col.key] as string | undefined;
    const href = col.hrefKey ? (row[col.hrefKey] as string | undefined) : undefined;
    return (
      <LinkCell
        value={value ?? ""}
        href={href}
        variant={col.title ? "title" : "default"}
        brand={col.brand}
      />
    );
  }

  return <TextCell value={row[col.key] as string | undefined} />;
}

function PlatformEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className={`text-lg font-extralight ${bento.ink}`}>Пока пусто</p>
      <p className={`mt-2 max-w-sm text-sm font-light ${bento.inkFaint}`}>
        Данные для этой платформы ещё не добавлены в таблицу.
      </p>
    </div>
  );
}

export function ComponentsTable({
  rows,
  columns,
  isPlatformEmpty,
  embedded = false,
}: ComponentsTableProps) {
  const wrapperClass = embedded ? "min-w-0" : `${bento.card} min-w-0 !p-0`;

  if (isPlatformEmpty) {
    return (
      <div className={wrapperClass}>
        <PlatformEmptyState />
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className={wrapperClass}>
        <p className={`px-6 py-12 text-center text-sm font-light ${bento.inkFaint}`}>
          Не удалось определить колонки таблицы.
        </p>
      </div>
    );
  }

  const minWidth = `${Math.max(columns.length * 9, 36)}rem`;

  return (
    <div className={wrapperClass}>
      <div className="hidden min-w-0 overflow-x-auto lg:block">
        <table className="w-full border-collapse text-left" style={{ minWidth }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="sticky top-0 z-10 bg-[var(--surface)]/80 px-4 py-4 text-left text-[10px] font-normal tracking-[0.14em] text-[var(--ink-faint)] uppercase backdrop-blur-md xl:px-8 xl:py-5"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.componentName}-${index}`}
                className="group transition-colors duration-300 hover:bg-[var(--row-hover)]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="max-w-[14rem] px-4 py-4 align-middle xl:max-w-none xl:px-8 xl:py-5"
                  >
                    {renderCell(row, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ComponentCards rows={rows} columns={columns} />
    </div>
  );
}
