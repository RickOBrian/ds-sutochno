"use client";

import { useRef, type ReactNode } from "react";
import { useScrollFade } from "./useScrollFade";

interface ScrollFadeContainerProps {
  children: ReactNode;
  className?: string;
}

export function ScrollFadeContainer({ children, className = "" }: ScrollFadeContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollFade(ref);

  return (
    <div ref={ref} className={`scroll-fade-y ${className}`.trim()}>
      {children}
    </div>
  );
}
