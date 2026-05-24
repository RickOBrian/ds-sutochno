import type { ReactNode } from "react";
import type { ComponentRow } from "@/types/component-row";
import { bento } from "@/lib/bento-styles";
import { EmptyDash } from "./EmptyDash";
import { GroomingBadge } from "./GroomingBadge";
import { LinkCell } from "./LinkCell";

interface ComponentCardsProps {
  rows: ComponentRow[];
}

function CardField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className={`${bento.label} normal-case`}>{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function ComponentCards({ rows }: ComponentCardsProps) {
  return (
    <ul className="min-w-0 divide-y divide-zinc-100/80 lg:hidden">
      {rows.map((row, index) => (
        <li key={`${row.componentName}-${index}`} className="px-3.5 py-4 sm:px-5 sm:py-5">
          <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <LinkCell
                value={row.componentName}
                href={row.componentNameUrl}
                variant="title"
                brand="figma"
              />
            </div>
            <div className="shrink-0 self-start">
              <GroomingBadge status={row.grooming} />
            </div>
          </div>
          <div className="grid gap-4">
            <CardField label="Тред грумминга">
              <LinkCell value={row.groomingThread} href={row.groomingThreadUrl} />
            </CardField>
            <CardField label="Ссылка на задачу">
              <LinkCell value={row.taskLink} href={row.taskLinkUrl} />
            </CardField>
            <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
              <CardField label="Исполнитель">
                {row.assignee.trim() ? (
                  <span className="break-words text-sm font-light text-zinc-600">
                    {row.assignee}
                  </span>
                ) : (
                  <EmptyDash />
                )}
              </CardField>
              <CardField label="План дата">
                {row.planDate.trim() ? (
                  <span className="text-sm font-light text-zinc-600">{row.planDate}</span>
                ) : (
                  <EmptyDash />
                )}
              </CardField>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
