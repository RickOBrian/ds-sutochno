"use client";

import { LayoutGroup, motion, useScroll, useTransform } from "framer-motion";
import { VISION_BENTO_TILES } from "@/lib/figma-vision-bento";
import { VisionHeader } from "./VisionHeader";
import { VisionTile } from "./VisionTile";
import { VisionTileContent } from "./vision-tile-content";
import { visionGridContainer } from "./vision-motion";

function VisionBackdrop() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.35]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full blur-[100px] 2xl:h-[40rem] 2xl:w-[40rem] 2xl:left-[30%]"
        style={{ y: y1, opacity, background: "var(--vision-red-glow)" }}
      />
      <motion.div
        className="absolute top-1/2 right-0 h-80 w-80 rounded-full blur-[80px]"
        style={{ y: y2, opacity, background: "rgba(212, 245, 74, 0.12)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

export function VisionPage() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-x-clip">
      <VisionBackdrop />

      <div className="ds-vision-shell relative min-h-dvh min-w-0 flex-1 pb-10 pt-3 md:pb-12 md:pt-4">
        <VisionHeader />
        <h1 className="sr-only">Дизайн-система</h1>

        <LayoutGroup id="vision-bento">
          <motion.div
            layout
            variants={visionGridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-5%" }}
            className="ds-vision-grid grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-4 lg:auto-rows-min"
          >
            {VISION_BENTO_TILES.map((tile) => (
              <VisionTile
                key={tile.id}
                tileId={tile.id}
                title={tile.title}
                surface={tile.surface}
                className={tile.className}
              >
                <VisionTileContent id={tile.id} />
              </VisionTile>
            ))}
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  );
}
