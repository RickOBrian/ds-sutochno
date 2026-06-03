"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type RowBarDef = {
  id: string;
  width: number;
  barClass: string;
};

type RowLayoutDef = {
  startLeft: number;
  bars: RowBarDef[];
};

type PlacedBar = RowBarDef & { left: number; rowIndex: number };

type TimelinePhase = {
  todayLeft: number;
  todayLabel: string;
  highlightIndex: number;
};

const BAR_ROW_GAP = 2.75;

const BASE_ROW_LAYOUTS: RowLayoutDef[] = [
  {
    startLeft: -7,
    bars: [
      { id: "a", width: 34, barClass: "bg-violet-500/35 ring-1 ring-violet-400/35" },
      { id: "c", width: 16, barClass: "bg-amber-500/30 ring-1 ring-amber-400/30" },
      { id: "d", width: 56, barClass: "bg-[var(--vision-red)]/45 ring-1 ring-[var(--vision-red)]/50" },
    ],
  },
  {
    startLeft: -10,
    bars: [
      { id: "b", width: 50, barClass: "bg-sky-500/35 ring-1 ring-sky-400/35" },
      { id: "e", width: 58, barClass: "bg-white/10 ring-1 ring-white/15" },
    ],
  },
];

const GRID_LINES = [18, 42, 68];

const SCALE_LABELS = [
  { left: 5, label: "12–18 янв" },
  { left: 36, label: "19–25 янв" },
  { left: 58, label: "26 янв – 1 фев" },
];

const TODAY_HIGHLIGHT_WIDTH = 22;

const PHASES: TimelinePhase[] = [
  { todayLeft: 20, todayLabel: "16 янв", highlightIndex: 0 },
  { todayLeft: 46, todayLabel: "22 янв", highlightIndex: 1 },
  { todayLeft: 70, todayLabel: "29 янв", highlightIndex: 2 },
];

const ROW_GAP_PX = 7;
const MIN_BAR_HEIGHT_PX = 17;
const MAX_BAR_HEIGHT_PX = 28;
const PHASE_MS = 4500;

function placeRow(row: RowLayoutDef, rowIndex: number): PlacedBar[] {
  let left = row.startLeft;

  return row.bars.map((bar) => {
    const placed = { ...bar, left, rowIndex };
    left += bar.width + BAR_ROW_GAP;
    return placed;
  });
}

function getRowLayouts(chartHeight: number): RowLayoutDef[] {
  const layouts = BASE_ROW_LAYOUTS.map((row) => ({
    startLeft: row.startLeft,
    bars: [...row.bars],
  }));

  if (chartHeight >= 118) {
    layouts.push({
      startLeft: -5,
      bars: [
        {
          id: "f",
          width: 112,
          barClass: "bg-emerald-500/25 ring-1 ring-emerald-400/30",
        },
      ],
    });
  }

  if (chartHeight >= 142) {
    layouts.push({
      startLeft: -8,
      bars: [
        {
          id: "g",
          width: 108,
          barClass: "bg-fuchsia-500/25 ring-1 ring-fuchsia-400/30",
        },
      ],
    });
  }

  return layouts;
}

export function VisionTimelineIllustration() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(104);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  const rowLayouts = useMemo(() => getRowLayouts(chartHeight), [chartHeight]);
  const placedBars = useMemo(
    () => rowLayouts.flatMap((row, rowIndex) => placeRow(row, rowIndex)),
    [rowLayouts],
  );
  const rowCount = rowLayouts.length;
  const phase = PHASES[phaseIndex];

  const barHeight = Math.min(
    MAX_BAR_HEIGHT_PX,
    Math.max(
      MIN_BAR_HEIGHT_PX,
      Math.floor((chartHeight - (rowCount - 1) * ROW_GAP_PX) / rowCount),
    ),
  );
  const stackHeight = rowCount * barHeight + (rowCount - 1) * ROW_GAP_PX;

  useLayoutEffect(() => {
    const node = chartRef.current;
    if (!node) return;

    const update = () => setChartHeight(node.clientHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setHasEntered(true), 120);
    const phaseTimer = window.setInterval(() => {
      setPhaseIndex((current) => (current + 1) % PHASES.length);
    }, PHASE_MS);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearInterval(phaseTimer);
    };
  }, []);

  return (
    <div
      className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
      aria-hidden
    >
      <div className="flex h-9 shrink-0 items-center justify-center gap-3 border-b border-white/[0.06] px-2.5 sm:px-3">
        {[
          { className: "bg-violet-400/80", label: "Моб." },
          { className: "bg-sky-400/80", label: "Веб" },
          { className: "bg-amber-400/80", label: "Токены" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.className}`} />
            <span className="text-[0.6rem] text-[var(--vision-faint)]">{item.label}</span>
          </span>
        ))}
      </div>

      <div
        ref={chartRef}
        className="relative min-h-[6.5rem] flex-1 overflow-hidden bg-transparent"
      >
        {GRID_LINES.map((left) => (
          <div
            key={left}
            className="pointer-events-none absolute inset-y-0 border-l border-white/[0.06]"
            style={{ left: `${left}%` }}
          />
        ))}

        <motion.div
          className="pointer-events-none absolute inset-y-0 z-[1] bg-white/[0.05]"
          style={{ width: `${TODAY_HIGHLIGHT_WIDTH}%` }}
          animate={{ left: `${phase.todayLeft}%`, x: "-50%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          className="pointer-events-none absolute inset-y-0 z-10 border-l-2 border-[var(--vision-red)]"
          animate={{ left: `${phase.todayLeft}%`, opacity: [0.7, 1, 0.85] }}
          transition={{
            left: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <div className="flex h-full items-center overflow-hidden">
          <div className="relative w-full" style={{ height: stackHeight }}>
            {placedBars.map((bar, index) => (
              <motion.div
                key={bar.id}
                className={`absolute overflow-hidden rounded-md shadow-sm ${bar.barClass}`}
                style={{
                  left: `${bar.left}%`,
                  width: `${bar.width}%`,
                  top: bar.rowIndex * (barHeight + ROW_GAP_PX),
                  height: barHeight,
                  transformOrigin: "left center",
                }}
                initial={{ scaleX: 0, opacity: 0.4 }}
                animate={
                  hasEntered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.4 }
                }
                transition={{
                  duration: 0.7,
                  delay: 0.1 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -1, zIndex: 10 }}
              >
                <div className="flex h-full flex-col justify-center px-2 py-0.5">
                  <motion.div
                    className="h-1 rounded-full bg-white/25"
                    initial={{ width: 0 }}
                    animate={hasEntered ? { width: "68%" } : { width: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 + index * 0.08 }}
                  />
                  <motion.div
                    className="mt-0.5 h-1 rounded-full bg-white/12"
                    initial={{ width: 0 }}
                    animate={hasEntered ? { width: "42%" } : { width: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 + index * 0.08 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex h-9 shrink-0 items-center border-t border-white/[0.06] bg-white/[0.03]">
        {SCALE_LABELS.map((tick, index) => (
          <motion.span
            key={tick.label}
            className="absolute top-1/2 max-w-[5.5rem] -translate-y-1/2 truncate text-[0.5625rem] leading-none sm:text-[0.625rem]"
            style={{ left: `${tick.left}%` }}
            animate={{
              color:
                index === phase.highlightIndex
                  ? "rgba(255, 255, 255, 0.85)"
                  : "rgba(255, 255, 255, 0.4)",
              scale: index === phase.highlightIndex ? 1.04 : 1,
            }}
            transition={{ duration: 0.45 }}
          >
            {tick.label}
          </motion.span>
        ))}

        <motion.div
          className="absolute top-0 z-20 -translate-x-1/2 -translate-y-[calc(100%+0.25rem)]"
          animate={{ left: `${phase.todayLeft}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase.todayLabel}
              className="block whitespace-nowrap rounded-full bg-[var(--vision-red)]/20 px-1.5 py-0.5 text-[0.5625rem] font-medium text-[var(--vision-red)] ring-1 ring-[var(--vision-red)]/40"
              initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
            >
              {phase.todayLabel}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
