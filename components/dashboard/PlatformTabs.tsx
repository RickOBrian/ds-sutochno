import type { Platform } from "@/lib/csv-sources";
import { PLATFORM_LABELS, PLATFORMS } from "@/lib/csv-sources";
import { bento } from "@/lib/bento-styles";

interface PlatformTabsProps {
  active: Platform;
  onChange: (platform: Platform) => void;
}

export function PlatformTabs({ active, onChange }: PlatformTabsProps) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-full bg-zinc-100/80 p-1 backdrop-blur-sm"
      role="tablist"
      aria-label="Платформы"
    >
      {PLATFORMS.map((platform) => {
        const isActive = platform === active;
        return (
          <button
            key={platform}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(platform)}
            className={isActive ? bento.pillActive : bento.pillIdle}
          >
            {PLATFORM_LABELS[platform]}
          </button>
        );
      })}
    </div>
  );
}
