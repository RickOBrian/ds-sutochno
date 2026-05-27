"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Platform } from "@/lib/csv-sources";
import { PLATFORMS, ROADMAP_CSV_URL } from "@/lib/csv-sources";
import { fetchPlatformData } from "@/lib/fetch-platform-data";
import { bento } from "@/lib/bento-styles";
import { calculatePlatformMetrics } from "@/lib/metrics";
import { fetchAndParseRoadmapCsv } from "@/lib/parse-roadmap-csv";
import type { PlatformSheetData } from "@/types/component-row";
import type { RoadmapTask } from "@/types/roadmap-task";
import { BentoHeader } from "./BentoHeader";
import { BentoMetrics } from "./BentoMetrics";
import { BentoSkeleton } from "./BentoSkeleton";
import { BentoTableWidget } from "./BentoTableWidget";
import { DashboardToolbar } from "./DashboardToolbar";
import { TimelineWidget } from "./TimelineWidget";

type PlatformData = Record<Platform, PlatformSheetData>;

const EMPTY_SHEET: PlatformSheetData = { rows: [], columns: [] };
type LoadState = "loading" | "ready" | "error";

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-32 right-[-8rem] h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "var(--ambient-a)" }}
      />
      <div
        className="absolute top-1/3 left-[-6rem] h-80 w-80 rounded-full blur-3xl"
        style={{ background: "var(--ambient-b)" }}
      />
      <div
        className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "var(--ambient-c)" }}
      />
    </div>
  );
}

export function DesignSystemDashboard() {
  const [activePlatform, setActivePlatform] = useState<Platform>("ios");
  const [data, setData] = useState<PlatformData>({
    ios: EMPTY_SHEET,
    android: EMPTY_SHEET,
    web: EMPTY_SHEET,
  });
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  const loadAllPlatforms = useCallback(async () => {
    setLoadState("loading");
    setError(null);

    try {
      const [platformResults, roadmap] = await Promise.all([
        Promise.all(
          PLATFORMS.map(async (platform) => {
            const rows = await fetchPlatformData(platform);
            return [platform, rows] as const;
          }),
        ),
        fetchAndParseRoadmapCsv(ROADMAP_CSV_URL),
      ]);

      setData(Object.fromEntries(platformResults) as PlatformData);
      setRoadmapTasks(roadmap);
      setLoadState("ready");
    } catch (err) {
      setLoadState("error");
      setError(err instanceof Error ? err.message : "Неизвестная ошибка загрузки");
    }
  }, []);

  useEffect(() => {
    void loadAllPlatforms();
  }, [loadAllPlatforms]);

  const activeSheet = data[activePlatform];
  const activeRows = activeSheet.rows;
  const activeColumns = activeSheet.columns;
  const metrics = useMemo(() => calculatePlatformMetrics(activeRows), [activeRows]);

  return (
    <div className="relative min-h-full overflow-x-clip bg-[var(--canvas)]">
      <AmbientBackground />

      <div className="relative mx-auto min-w-0 max-w-7xl p-3 sm:p-4 md:p-8">
        <BentoHeader />

        {loadState === "ready" && (
          <DashboardToolbar
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
          />
        )}

        {loadState === "loading" && <BentoSkeleton />}

        {loadState === "error" && (
          <div
            className={`${bento.card} p-8`}
            role="alert"
          >
            <p className={`text-lg font-extralight ${bento.ink}`}>Не удалось загрузить данные</p>
            <p className="mt-2 text-sm font-light text-red-500/90 dark:text-red-400/90">{error}</p>
            <button
              type="button"
              onClick={() => void loadAllPlatforms()}
              className={`mt-6 ${bento.btnPrimary}`}
            >
              Повторить
            </button>
          </div>
        )}

        {loadState === "ready" && (
          <div className="flex min-w-0 flex-col gap-4 sm:gap-5 md:gap-6">
            <BentoMetrics metrics={metrics} animationKey={activePlatform} />
            <BentoTableWidget
              rows={activeRows}
              columns={activeColumns}
              isPlatformEmpty={activeRows.length === 0}
            />
            <TimelineWidget tasks={roadmapTasks} />
          </div>
        )}
      </div>
    </div>
  );
}
