"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Platform } from "@/lib/csv-sources";
import { PLATFORMS } from "@/lib/csv-sources";
import { fetchPlatformData } from "@/lib/fetch-platform-data";
import { calculatePlatformMetrics } from "@/lib/metrics";
import type { ComponentRow } from "@/types/component-row";
import { BentoHeader } from "./BentoHeader";
import { BentoMetrics } from "./BentoMetrics";
import { BentoSkeleton } from "./BentoSkeleton";
import { BentoTableWidget } from "./BentoTableWidget";
import { DashboardToolbar } from "./DashboardToolbar";

type PlatformData = Record<Platform, ComponentRow[]>;
type LoadState = "loading" | "ready" | "error";

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-32 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[var(--lime-glow)] blur-3xl" />
      <div className="absolute top-1/3 left-[-6rem] h-80 w-80 rounded-full bg-zinc-200/50 blur-3xl" />
      <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
    </div>
  );
}

export function DesignSystemDashboard() {
  const [activePlatform, setActivePlatform] = useState<Platform>("ios");
  const [data, setData] = useState<PlatformData>({ ios: [], android: [], web: [] });
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllPlatforms = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setLoadState("loading");
    }
    setError(null);

    try {
      const results = await Promise.all(
        PLATFORMS.map(async (platform) => {
          const rows = await fetchPlatformData(platform);
          return [platform, rows] as const;
        }),
      );

      setData(Object.fromEntries(results) as PlatformData);
      setLoadState("ready");
    } catch (err) {
      setLoadState("error");
      setError(err instanceof Error ? err.message : "Неизвестная ошибка загрузки");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadAllPlatforms();
  }, [loadAllPlatforms]);

  const activeRows = data[activePlatform];
  const metrics = useMemo(() => calculatePlatformMetrics(activeRows), [activeRows]);

  const handleRefresh = () => {
    if (loadState === "ready") {
      void loadAllPlatforms({ silent: true });
    } else {
      void loadAllPlatforms();
    }
  };

  return (
    <div className="relative min-h-full overflow-x-clip bg-[var(--canvas)]">
      <AmbientBackground />

      <div className="relative mx-auto min-w-0 max-w-7xl p-3 sm:p-4 md:p-8">
        <BentoHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

        {loadState === "ready" && (
          <DashboardToolbar
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
          />
        )}

        {loadState === "loading" && <BentoSkeleton />}

        {loadState === "error" && (
          <div
            className="rounded-[2rem] bg-white p-8 shadow-[var(--shadow-float)]"
            role="alert"
          >
            <p className="text-lg font-extralight text-zinc-900">Не удалось загрузить данные</p>
            <p className="mt-2 text-sm font-light text-red-500/90">{error}</p>
            <button
              type="button"
              onClick={() => void loadAllPlatforms()}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-normal text-white transition hover:bg-zinc-800"
            >
              Повторить
            </button>
          </div>
        )}

        {loadState === "ready" && (
          <div className="flex min-w-0 flex-col gap-4 sm:gap-5 md:gap-6">
            <BentoMetrics metrics={metrics} animationKey={activePlatform} />
            <BentoTableWidget rows={activeRows} isPlatformEmpty={activeRows.length === 0} />
          </div>
        )}
      </div>
    </div>
  );
}
