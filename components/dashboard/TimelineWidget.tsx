"use client";

import { motion } from "framer-motion";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { collectLegendItems } from "@/lib/roadmap-colors";
import { countTasksOnMoscowWeek } from "@/lib/moscow-week";
import { buildTimelineLayout } from "@/lib/timeline-layout";
import type { RoadmapTask } from "@/types/roadmap-task";

const CHART_PADDING_Y = 16;
const COLUMN_GAP_PX = 10;
const MIN_CONTENT_HEIGHT_PX = 160;
/** Достаточно для ~4–5 колбасок; выше — вертикальный скролл */
const MAX_VIEWPORT_HEIGHT_PX = 400;
const SCALE_HEIGHT = 48;

interface TimelineWidgetProps {
  tasks: RoadmapTask[];
}

function TimelineEmpty() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-lg font-extralight text-zinc-900">Роудмап пуст</p>
      <p className="mt-2 max-w-sm text-sm font-light text-zinc-400">
        Добавьте задачи с датами начала и окончания в таблицу.
      </p>
    </div>
  );
}

function TimelineLegend({ tasks }: { tasks: RoadmapTask[] }) {
  const items = collectLegendItems(tasks);

  if (items.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100/80 px-4 py-3 sm:px-6"
      role="list"
      aria-label="Легенда роудмапа"
    >
      {items.map((item) => (
        <div key={item.categoryKey} className="flex items-center gap-2" role="listitem">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.legendClass}`}
            aria-hidden
          />
          <span className="text-xs font-normal text-zinc-500">{item.categoryLabel}</span>
        </div>
      ))}
    </div>
  );
}

function centerTodayInScroll(
  scrollEl: HTMLDivElement,
  todayLeftPx: number,
  startInsetPx: number,
): void {
  if (scrollEl.scrollWidth <= scrollEl.clientWidth) {
    scrollEl.scrollLeft = 0;
    return;
  }

  const todayX = startInsetPx + todayLeftPx;
  const target = todayX - scrollEl.clientWidth / 2;
  scrollEl.scrollLeft = Math.max(
    0,
    Math.min(target, scrollEl.scrollWidth - scrollEl.clientWidth),
  );
}

export function TimelineWidget({ tasks }: TimelineWidgetProps) {
  const layout = useMemo(() => buildTimelineLayout(tasks), [tasks]);
  const tasksThisWeek = useMemo(() => countTasksOnMoscowWeek(tasks), [tasks]);
  const [contentHeightPx, setContentHeightPx] = useState(MIN_CONTENT_HEIGHT_PX);
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const startInsetRef = useRef<HTMLDivElement>(null);

  const measureColumns = useCallback(() => {
    let maxHeight = 0;

    for (const el of columnRefs.current.values()) {
      maxHeight = Math.max(maxHeight, el.offsetHeight);
    }

    if (maxHeight > 0) {
      setContentHeightPx(Math.max(maxHeight + CHART_PADDING_Y * 2, MIN_CONTENT_HEIGHT_PX));
    }
  }, []);

  const [startInsetPx, setStartInsetPx] = useState(16);

  useLayoutEffect(() => {
    const insetEl = startInsetRef.current;
    if (!insetEl) return;

    const update = () => setStartInsetPx(insetEl.offsetWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(insetEl);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      measureColumns();
    });

    const observer = new ResizeObserver(() => {
      measureColumns();
    });

    for (const el of columnRefs.current.values()) {
      observer.observe(el);
    }

    const delayed = window.setTimeout(measureColumns, 900);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(delayed);
      observer.disconnect();
    };
  }, [layout, measureColumns]);

  useLayoutEffect(() => {
    if (!layout || layout.todayLeftPx === null) return;

    const scrollEl = horizontalScrollRef.current;
    if (!scrollEl) return;

    const apply = () => {
      centerTodayInScroll(scrollEl, layout.todayLeftPx!, startInsetPx);
    };

    const raf = requestAnimationFrame(apply);
    const observer = new ResizeObserver(apply);
    observer.observe(scrollEl);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [layout, startInsetPx]);

  if (!layout) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="col-span-full min-w-0 overflow-hidden rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        aria-label="Роудмап"
      >
        <TimelineEmpty />
      </motion.section>
    );
  }

  const viewportHeightPx = Math.min(contentHeightPx, MAX_VIEWPORT_HEIGHT_PX);
  const needsVerticalScroll = contentHeightPx > MAX_VIEWPORT_HEIGHT_PX;
  const scrollContentHeight = contentHeightPx;

  const trackOuterWidthPx = layout.scale.trackWidthPx + startInsetPx;

  let barIndex = 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-full min-w-0 overflow-hidden rounded-3xl bg-white shadow-sm"
      aria-label="Роудмап"
    >
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-lg font-extralight tracking-tight text-zinc-900 sm:text-xl">
          Roadmap
        </h2>
        <p className="mt-1 text-xs font-light text-zinc-400">
          Задач на этой неделе: {tasksThisWeek}
        </p>
      </div>

      <TimelineLegend tasks={tasks} />

      <div className="relative pb-4 sm:pb-5">
        <div
          ref={horizontalScrollRef}
          className="timeline-scroll w-full overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Шкала времени роудмапа"
        >
          <div
            className="flex min-w-full"
            style={{
              width: `max(100%, ${trackOuterWidthPx}px)`,
            }}
          >
            <div
              ref={startInsetRef}
              className="w-2 shrink-0 sm:w-4"
              aria-hidden
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
              <div
                className={`timeline-scroll-y relative w-full overflow-x-hidden ${needsVerticalScroll ? "overflow-y-auto" : "overflow-y-visible"}`}
              style={{
                maxHeight: needsVerticalScroll ? viewportHeightPx : undefined,
                height: needsVerticalScroll ? viewportHeightPx : scrollContentHeight,
              }}
            >
              <div
                className="relative"
                style={{
                  width: layout.scale.trackWidthPx,
                  height: scrollContentHeight,
                  paddingTop: CHART_PADDING_Y,
                  paddingBottom: CHART_PADDING_Y,
                }}
              >
                {layout.markers.map((marker) => (
                  <div
                    key={marker.date.toISOString()}
                    className="pointer-events-none absolute top-0 border-l border-slate-100"
                    style={{
                      left: marker.leftPx,
                      height: scrollContentHeight - CHART_PADDING_Y * 2,
                      top: CHART_PADDING_Y,
                    }}
                  />
                ))}

                {layout.todayLeftPx !== null && (
                  <div
                    className="pointer-events-none absolute z-20 border-l-2 border-red-300"
                    style={{
                      left: layout.todayLeftPx,
                      top: CHART_PADDING_Y,
                      height: scrollContentHeight - CHART_PADDING_Y * 2,
                    }}
                    aria-hidden
                  />
                )}

                {layout.columns.map((column) => (
                  <div
                    key={column.columnKey}
                    ref={(node) => {
                      if (node) columnRefs.current.set(column.columnKey, node);
                      else columnRefs.current.delete(column.columnKey);
                    }}
                    className="absolute top-0 flex flex-col"
                    style={{
                      left: column.anchorLeftPx,
                      top: CHART_PADDING_Y,
                      gap: COLUMN_GAP_PX,
                      maxWidth: layout.scale.trackWidthPx - column.anchorLeftPx,
                    }}
                  >
                    {column.tasks.map((task) => {
                      const index = barIndex;
                      barIndex += 1;

                      return (
                        <motion.div
                          key={task.id}
                          title={
                            task.assignee ? `${task.title} · ${task.assignee}` : task.title
                          }
                          initial={{ width: 0, opacity: 0.6 }}
                          animate={{ width: task.widthPx, opacity: 1 }}
                          transition={{
                            duration: 0.75,
                            delay: 0.08 + index * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={`box-border min-h-8 rounded-md px-2 py-1.5 shadow-sm ${task.style.barClass}`}
                        >
                          <span
                            className={`block text-[11px] leading-[1.4] font-medium break-words hyphens-auto ${task.style.textClass}`}
                          >
                            {task.title}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="relative w-full shrink-0 border-t border-slate-100/80 bg-white"
              style={{ height: SCALE_HEIGHT }}
            >
              <div
                className="relative h-full"
                style={{ width: layout.scale.trackWidthPx }}
              >
                {layout.columns.map((column) => (
                  <span
                    key={`date-${column.columnKey}`}
                    className="absolute bottom-2 max-w-[9rem] text-left text-[10px] leading-tight font-light text-zinc-400 sm:max-w-none sm:text-xs"
                    style={{ left: column.anchorLeftPx }}
                  >
                    {column.dateRangeLabel}
                  </span>
                ))}

                {layout.todayLeftPx !== null && (
                  <span
                    className="absolute bottom-7 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500"
                    style={{ left: layout.todayLeftPx }}
                  >
                    Сегодня
                  </span>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
