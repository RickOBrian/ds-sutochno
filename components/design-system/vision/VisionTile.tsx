"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { VisionTileId, VisionTileSurface } from "@/lib/figma-vision-bento";
import { usePointerTilt } from "./usePointerTilt";
import { MascotDucksBackdrop } from "./MascotDucksBackdrop";
import { useVisionTileMotion } from "./vision-motion";

const surfaceClass: Record<VisionTileSurface, string> = {
  dark: "bg-[var(--vision-tile)]",
  elevated: "bg-[var(--vision-tile-elevated)]",
  red: "bg-gradient-to-br from-[var(--vision-red)] via-[#ef4444] to-[var(--vision-red-deep)]",
  glass: "bg-[var(--vision-glass)] backdrop-blur-xl",
  "liquid-glass": "vision-liquid-glass",
};

interface VisionTileProps {
  tileId: VisionTileId;
  title: string;
  surface: VisionTileSurface;
  className: string;
  children: ReactNode;
  glow?: boolean;
}

export function VisionTile({
  tileId,
  title,
  surface,
  className,
  children,
  glow = false,
}: VisionTileProps) {
  const { enter, hoverLift, reduceMotion, visionLayoutTransition } = useVisionTileMotion();
  const { ref, transform, onPointerMove, onPointerLeave } = usePointerTilt(
    !reduceMotion && tileId !== "personalization",
  );

  const fullBleed =
    tileId === "humor" ||
    tileId === "personalization" ||
    tileId === "spotlightVideo" ||
    tileId === "spotlightImages" ||
    tileId === "micro";

  return (
    <motion.article
      layout={!reduceMotion}
      layoutId={`vision-tile-${tileId}`}
      transition={visionLayoutTransition}
      variants={enter}
      whileHover={reduceMotion ? undefined : hoverLift}
      className={[
        "group relative z-0 flex min-h-0 flex-col rounded-[1.75rem] ring-1 ring-[var(--vision-border)] sm:rounded-[2rem]",
        tileId === "emotional" ? "overflow-visible" : "overflow-hidden",
        "transition-[box-shadow] duration-500",
        "hover:z-10 hover:shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
        glow ? "hover:shadow-[0_28px_90px_var(--vision-red-glow)]" : "",
        surface === "liquid-glass"
          ? "ring-white/15 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          : "",
        surfaceClass[surface],
        className,
      ].join(" ")}
    >
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ transform }}
        className="relative flex min-h-0 min-w-0 flex-1 flex-col will-change-transform"
      >
        {tileId === "mascot" ? <MascotDucksBackdrop /> : null}

        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
        </div>

        <div
          className={[
            "relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col",
            fullBleed ? "h-full w-full" : "p-5 sm:p-6",
          ].join(" ")}
        >
          {title ? (
            <h2
              className={[
                tileId === "humor"
                  ? "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white/32"
                  : "text-sm font-normal tracking-tight sm:text-[0.9375rem]",
                tileId === "humor"
                  ? ""
                  : surface === "red"
                    ? "text-white/88"
                    : "text-[var(--vision-muted)]",
                fullBleed
                  ? "pointer-events-none absolute left-5 top-5 z-20 sm:left-6 sm:top-6"
                  : "",
              ].join(" ")}
            >
              {title}
            </h2>
          ) : null}
          <div
            className={
              fullBleed
                ? "relative min-h-0 flex-1"
                : `flex min-h-0 flex-1 flex-col ${title ? "mt-3" : ""}`
            }
          >
            {children}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
