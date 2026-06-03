import { Roboto_Flex } from "next/font/google";

/** Параметры Roboto Flex из Figma (variable) */
export const UTOPIA_DS_FONT_VARIATION =
  '"wght" 800, "GRAD" -100, "XOPQ" 175, "YOPQ" 64, "YTUC" 760, "slnt" -10, "wdth" 80';

export const utopiaDsLogoFont = Roboto_Flex({
  subsets: ["latin"],
  weight: "variable",
  display: "block",
  axes: ["GRAD", "XOPQ", "YOPQ", "YTUC", "slnt", "wdth"],
});
