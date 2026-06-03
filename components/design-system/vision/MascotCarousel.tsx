"use client";

import { motion, useReducedMotion } from "framer-motion";

type MascotPlateDef = {
  id: number;
  label: string;
  imageSrc: string;
};

const PLATE_BG = "bg-[var(--vision-tile)] ring-1 ring-[var(--vision-border)]";

const MASCOT_PLATES: MascotPlateDef[] = [
  {
    id: 1,
    label: "Космонавт",
    imageSrc: "/images/vision/mascot-plates/01.png",
  },
  {
    id: 2,
    label: "Турист",
    imageSrc: "/images/vision/mascot-plates/02.png",
  },
  {
    id: 3,
    label: "Deprecated",
    imageSrc: "/images/vision/mascot-plates/03.png",
  },
  {
    id: 4,
    label: "Аристократ",
    imageSrc: "/images/vision/mascot-plates/04.png",
  },
  {
    id: 5,
    label: "Мим",
    imageSrc: "/images/vision/mascot-plates/05.png",
  },
  {
    id: 6,
    label: "Sensei",
    imageSrc: "/images/vision/mascot-plates/06.png",
  },
  {
    id: 7,
    label: "Гавайи",
    imageSrc: "/images/vision/mascot-plates/07.png",
  },
];

/** Порядок ленты: 7 → 1 → … → 6 (перед стартом слева уже «7») */
const CAROUSEL_SEQUENCE = [6, 0, 1, 2, 3, 4, 5].map((index) => MASCOT_PLATES[index]);

/** Запас сверху под hover-подъём (y: -10 + spring) */
const HOVER_CLEARANCE = "pt-4";

function MascotPlateCard({ plate }: { plate: MascotPlateDef }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={[
        "mascot-carousel-plate relative aspect-square w-[4.75rem] shrink-0 overflow-hidden rounded-3xl shadow-xl",
        "sm:w-[5.25rem] 2xl:w-[5.75rem]",
        PLATE_BG,
      ].join(" ")}
      whileHover={reduceMotion ? undefined : { y: -10 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      aria-label={plate.label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={plate.imageSrc}
        alt=""
        width={184}
        height={184}
        className="absolute inset-0 block h-full w-full object-cover object-center"
        draggable={false}
        decoding="async"
      />
    </motion.div>
  );
}

export function MascotCarousel() {
  const reduceMotion = useReducedMotion();
  const track = [...CAROUSEL_SEQUENCE, ...CAROUSEL_SEQUENCE];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="relative z-10 mt-auto flex w-full flex-1 items-end">
        <div
          className={[
            "-mx-5 w-[calc(100%+2.5rem)] overflow-hidden sm:-mx-6 sm:w-[calc(100%+3rem)]",
            "2xl:-mx-7 2xl:w-[calc(100%+3.5rem)] 3xl:-mx-8 3xl:w-[calc(100%+4rem)]",
            HOVER_CLEARANCE,
          ].join(" ")}
        >
          {reduceMotion ? (
            <div className="flex w-max items-end gap-1.5 sm:gap-2">
              {CAROUSEL_SEQUENCE.map((plate) => (
                <MascotPlateCard key={plate.id} plate={plate} />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex w-max items-end gap-1.5 will-change-transform sm:gap-2"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 32, ease: "linear", repeat: Infinity }}
            >
              {track.map((plate, index) => (
                <MascotPlateCard key={`${plate.id}-${index}`} plate={plate} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
