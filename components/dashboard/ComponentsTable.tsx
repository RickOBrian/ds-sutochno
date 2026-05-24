import type { ComponentRow } from "@/types/component-row";
import { bento } from "@/lib/bento-styles";
import { ComponentCards } from "./ComponentCards";
import { EmptyDash } from "./EmptyDash";
import { GroomingBadge } from "./GroomingBadge";
import { LinkCell, type LinkBrand } from "./LinkCell";

const COLUMNS: {
  key: keyof ComponentRow;
  label: string;
  kind: "link" | "badge" | "text";
  hrefKey?: keyof ComponentRow;
  title?: boolean;
  brand?: LinkBrand;
}[] = [
  {
    key: "componentName",
    label: "Компонент",
    kind: "link",
    hrefKey: "componentNameUrl",
    title: true,
    brand: "figma",
  },
  { key: "groomingThread", label: "Тред", kind: "link", hrefKey: "groomingThreadUrl" },
  { key: "grooming", label: "Статус", kind: "badge" },
  { key: "taskLink", label: "Задача", kind: "link", hrefKey: "taskLinkUrl" },
  { key: "assignee", label: "Исполнитель", kind: "text" },
  { key: "planDate", label: "План", kind: "text" },
];

interface ComponentsTableProps {
  rows: ComponentRow[];
  isPlatformEmpty: boolean;
  embedded?: boolean;
}

function TextCell({ value }: { value: string }) {
  const trimmed = value.trim();
  if (!trimmed) return <EmptyDash />;
  return <span className="text-sm font-light text-zinc-600">{trimmed}</span>;
}

function PlatformEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="text-lg font-extralight text-zinc-900">Пока пусто</p>
      <p className="mt-2 max-w-sm text-sm font-light text-zinc-400">
        Данные для этой платформы ещё не добавлены в таблицу.
      </p>
    </div>
  );
}

export function ComponentsTable({ rows, isPlatformEmpty, embedded = false }: ComponentsTableProps) {
  const wrapperClass = embedded
    ? "min-w-0"
    : `${bento.card} min-w-0 !p-0`;

  if (isPlatformEmpty) {
    return (
      <div className={wrapperClass}>
        <PlatformEmptyState />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className="hidden min-w-0 overflow-x-auto lg:block">
        <table className="w-full min-w-[52rem] border-collapse text-left">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="sticky top-0 z-10 bg-white/80 px-4 py-4 text-left text-[10px] font-normal tracking-[0.14em] text-zinc-400 uppercase backdrop-blur-md xl:px-8 xl:py-5"
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
                className="group transition-colors duration-300 hover:bg-zinc-50/40"
              >
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className="max-w-[14rem] px-4 py-4 align-middle xl:max-w-none xl:px-8 xl:py-5"
                  >
                    {col.kind === "badge" ? (
                      <GroomingBadge status={row.grooming} />
                    ) : col.kind === "link" ? (
                      <LinkCell
                        value={String(row[col.key])}
                        href={
                          col.hrefKey ? (row[col.hrefKey] as string | undefined) : undefined
                        }
                        variant={col.title ? "title" : "default"}
                        brand={col.brand}
                      />
                    ) : (
                      <TextCell value={String(row[col.key])} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ComponentCards rows={rows} />
    </div>
  );
}
