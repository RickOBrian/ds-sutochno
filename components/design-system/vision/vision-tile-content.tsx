"use client";

import { motion } from "framer-motion";
import { Flame, Plus, ShoppingBag } from "lucide-react";
import type { VisionTileId } from "@/lib/figma-vision-bento";
import { VISION_COPY } from "@/lib/figma-vision-bento";
import { onDarkChrome } from "@/lib/on-surface-text";
import { TypewriterLoop } from "./TypewriterLoop";
import { MascotCarousel } from "./MascotCarousel";
import { VisionTimelineIllustration } from "./VisionTimelineIllustration";
import { VisionDinoGame } from "./VisionDinoGame";
import { VisionTypographyIllustration } from "./VisionTypographyIllustration";
import { UtopiaDsLogo } from "./UtopiaDsLogo";
import { VisionUtopiaCardsStack } from "./VisionUtopiaCardsStack";
import { VisionMicroGridIllustration } from "./VisionMicroGridIllustration";

export function VisionTileContent({ id }: { id: VisionTileId }) {
  switch (id) {
    case "emotional":
      return (
        <div className="relative mt-auto flex min-h-[10rem] flex-1 items-center justify-center">
          <motion.div
            className="flex w-full max-w-[min(100%,20rem)] justify-center sm:max-w-md md:max-w-lg 2xl:max-w-xl"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <UtopiaDsLogo className="h-auto w-full" />
          </motion.div>
        </div>
      );

    case "mascot":
      return <MascotCarousel />;

    case "communication":
      return (
        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/vision/communication-avatar.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/12"
            draggable={false}
            decoding="async"
          />

          <div className="mt-auto flex flex-1 items-end pt-4">
            <motion.div
              className="w-full rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <p className="min-h-[2.75rem] text-sm font-normal leading-relaxed text-white/90">
                <TypewriterLoop text={VISION_COPY.communicationMessage} />
              </p>
            </motion.div>
          </div>
        </div>
      );

    case "personalization":
      return (
        <div className="absolute inset-0 min-h-0 min-w-0">
          <VisionDinoGame />
        </div>
      );

    case "spotlightImages":
      return <VisionUtopiaCardsStack className="size-full min-h-0" />;

    case "spotlightVideo":
      return <VisionTimelineIllustration />;

    case "humor":
      return <VisionTypographyIllustration />;

    case "gamification":
      return (
        <div className="mt-auto space-y-3">
          <p className={`text-xs font-normal ${onDarkChrome.faint}`}>
            {VISION_COPY.gamificationSubtitle}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 2xl:gap-4">
            {VISION_COPY.gamificationLevels.map((level, i) => {
              const icons = [Plus, Flame, ShoppingBag];
              const Icon = icons[i];
              return (
                <motion.div
                  key={level}
                  className="flex flex-1 items-center gap-3 rounded-2xl bg-[var(--vision-tile-elevated)] px-4 py-3 ring-1 ring-[var(--vision-border)]"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ${onDarkChrome.soft}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="text-2xl font-extralight tabular-nums text-[var(--vision-text)]">
                    {level}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      );

    case "micro":
      return <VisionMicroGridIllustration />;

    default:
      return null;
  }
}
