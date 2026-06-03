"use client";

import { UTOPIA_DS_FONT_VARIATION, utopiaDsLogoFont } from "./utopia-logo-font";

type UtopiaDsLogoProps = {
  className?: string;
};

/** Векторный логотип UTOPIA DS — Roboto Flex (оси из Figma) */
export function UtopiaDsLogo({ className }: UtopiaDsLogoProps) {
  return (
    <svg
      viewBox="0 0 226 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
      className={[utopiaDsLogoFont.className, className].filter(Boolean).join(" ")}
      role="img"
      aria-label="UTOPIA DS"
      shapeRendering="geometricPrecision"
    >
      <text
        x="50%"
        y="27"
        textAnchor="middle"
        fill="#fff"
        fontSize="28"
        style={{
          fontFamily: utopiaDsLogoFont.style.fontFamily,
          fontVariationSettings: UTOPIA_DS_FONT_VARIATION,
        }}
      >
        UTOPIA DS
      </text>
    </svg>
  );
}
