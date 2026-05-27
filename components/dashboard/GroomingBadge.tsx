import { getBadgeClass } from "@/lib/status-config";
import { EmptyDash } from "./EmptyDash";

interface GroomingBadgeProps {
  status: string;
  colorHex?: string;
}

export function GroomingBadge({ status, colorHex }: GroomingBadgeProps) {
  const trimmed = status.trim();

  if (!trimmed) {
    return <EmptyDash />;
  }

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-[11px] font-normal sm:px-2.5 sm:py-1 sm:text-xs ${getBadgeClass(trimmed, colorHex)}`}
    >
      <span className="truncate">{trimmed}</span>
    </span>
  );
}
