import type { RoadmapBarStyle } from "@/lib/roadmap-colors";

export interface RoadmapTask {
  id: string;
  title: string;
  assignee: string;
  start: Date;
  end: Date;
  style: RoadmapBarStyle;
}

export interface TimelineColumnTask {
  id: string;
  title: string;
  assignee: string;
  widthPx: number;
  style: RoadmapBarStyle;
}

/** Вертикальный столбец задач с одним днём старта */
export interface TimelineColumn {
  columnKey: string;
  anchorLeftPx: number;
  dateRangeLabel: string;
  tasks: TimelineColumnTask[];
}

export interface TimelineRange {
  minDate: Date;
  maxDate: Date;
  totalMs: number;
  spanDays: number;
}

export interface TimelineMarker {
  date: Date;
  leftPx: number;
  label: string;
}

export interface TimelineScale {
  pxPerDay: number;
  trackWidthPx: number;
}

export interface TimelineLayout {
  range: TimelineRange;
  scale: TimelineScale;
  columns: TimelineColumn[];
  markers: TimelineMarker[];
  todayLeftPx: number | null;
}
