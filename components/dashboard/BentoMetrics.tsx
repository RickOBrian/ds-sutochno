"use client";

import { Layers } from "lucide-react";
import { bento } from "@/lib/bento-styles";
import {
  getDesktopMetricColumns,
  getStatusGridClass,
} from "@/lib/metrics-layout";
import type { Platform } from "@/lib/csv-sources";
import type { PlatformMetrics, StatusMetric } from "@/lib/metrics";
import { AnimatedNumber } from "./AnimatedNumber";
import { BentoCard } from "./BentoCard";

const APPROVED_STATUS_KEY = "согласовано";

interface BentoMetricsProps {
  metrics: PlatformMetrics;
  animationKey: Platform;
}

function StatusMetricCard({
  item,
  delay,
  animationKey,
}: {
  item: StatusMetric;
  delay: number;
  animationKey: Platform;
}) {
  const Icon = item.theme.icon;
  const showShare = item.key === APPROVED_STATUS_KEY;

  return (
    <BentoCard delay={delay} variant="status" className="min-w-0 lg:min-h-[168px]">
      {/* Компактно на мобиле: подпись целиком, число ниже */}
      <div className="flex min-w-0 gap-2.5 lg:hidden">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.theme.iconClass}`}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`${bento.label} leading-snug wrap-break-word`}>{item.label}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className={bento.statusMetricInline}>
              <AnimatedNumber value={item.count} replayKey={animationKey} />
            </p>
            {showShare && (
              <span
                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${item.theme.shareBadgeClass}`}
              >
                {item.share}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bento-раскладка на desktop */}
      <div className="hidden min-w-0 flex-col justify-between gap-8 lg:flex lg:min-h-[140px]">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.theme.iconClass}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className={bento.label}>{item.label}</p>
          <p className={`mt-3 ${bento.statusMetricBento} text-zinc-900`}>
            <AnimatedNumber value={item.count} replayKey={animationKey} />
          </p>
          {showShare && (
            <span
              className={`mt-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.theme.shareBadgeClass}`}
            >
              {item.share}%
            </span>
          )}
        </div>
      </div>
    </BentoCard>
  );
}

export function BentoMetrics({ metrics, animationKey }: BentoMetricsProps) {
  const { total, statuses } = metrics;
  const statusCount = statuses.length;
  const desktopCols = getDesktopMetricColumns(statusCount);

  return (
    <div
      className="col-span-full min-w-0 flex flex-col gap-2 sm:gap-3 md:gap-5 lg:grid lg:gap-5"
      style={
        statusCount > 0
          ? { gridTemplateColumns: `repeat(${desktopCols}, minmax(0, 1fr))` }
          : undefined
      }
      role="region"
      aria-label="Статистика по статусам"
    >
      <BentoCard
        variant="dark"
        delay={0.05}
        compact
        className={
          statusCount > 0
            ? "min-w-0 lg:col-span-2 lg:min-h-[168px]"
            : "min-w-0"
        }
      >
        <div className="flex flex-col gap-3 sm:gap-4 lg:justify-between lg:gap-10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/80 sm:h-10 sm:w-10 sm:rounded-2xl lg:h-11 lg:w-11">
            <Layers className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-normal tracking-wide text-zinc-400">
              Всего в дизайн-системе
            </p>
            <p className={`mt-1 ${bento.metricHeroCompact} text-white lg:mt-3`}>
              <AnimatedNumber value={total} replayKey={animationKey} />
            </p>
            <p className="mt-2 text-xs font-light text-zinc-500 sm:text-sm lg:mt-3">
              компонентов на платформе
            </p>
          </div>
        </div>
      </BentoCard>

      {statusCount > 0 && (
        <div
          className={`grid min-w-0 gap-2 sm:gap-2.5 md:gap-5 ${getStatusGridClass(statusCount)} lg:contents`}
        >
          {statuses.map((item, index) => (
            <StatusMetricCard
              key={item.key}
              item={item}
              delay={0.12 + index * 0.06}
              animationKey={animationKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}
