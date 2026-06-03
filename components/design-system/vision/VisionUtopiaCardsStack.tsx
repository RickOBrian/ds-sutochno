"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
  type Transition,
  type Variants,
} from "framer-motion";

/** ~30% ширины — порог «дотянуть» (Tinder position) */
const POSITION_THRESHOLD_RATIO = 0.3;
/** px/s — лёгкий flick (ниже = не случайные вылеты) */
const VELOCITY_THRESHOLD = 640;

const EASE_OUT: [number, number, number, number] = [0.33, 1, 0.68, 1];
const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Возврат на место — мягкая пружина с лёгким отскоком (Reigns / iOS smooth) */
const SNAP_BACK: Transition = {
  type: "spring",
  duration: 0.48,
  bounce: 0.18,
};

/** Подъём следующей карточки в центр */
const PROMOTE: Transition = {
  type: "spring",
  duration: 0.58,
  bounce: 0.12,
};

/** Hover-peek задних карт */
const PEEK: Transition = {
  type: "spring",
  duration: 0.42,
  bounce: 0.08,
};

/** Улет — easeOut, без пружинного рывка (Tinder fly-away ~0.3–0.4s) */
const FLY_OUT: Transition = {
  type: "tween",
  duration: 0.42,
  ease: EASE_OUT,
};

const STACK_VARIANTS = {
  rest: {},
  hover: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
} satisfies Variants;

const CARD_SRC = "/images/vision/utopia-card-base.png";

/** Соотношение сторон карточки из Figma */
const STACK_ASPECT = 386 / 388;
/** Запас под поворот веера и тень — чтобы не вылезало за clip */
const FAN_BLEED = 1.22;

/** Колода — по кругу; cursor растёт бесконечно, индекс = cursor % length */
const DECK = [
  { id: "card-0", src: CARD_SRC },
  { id: "card-1", src: CARD_SRC },
  { id: "card-2", src: CARD_SRC },
  { id: "card-3", src: CARD_SRC },
  { id: "card-4", src: CARD_SRC },
  { id: "card-5", src: CARD_SRC },
  { id: "card-6", src: CARD_SRC },
] as const;

const EXIT_MS = 480;

/** Глубина стопки: 3-я (дальше) → 2-я → 1-я (верх) */
type DepthSlot = "third" | "second" | "top";

type SlotPose = {
  rotate: number;
  x: string;
  y: string;
  scale: number;
};

const SLOT_STYLE: Record<
  DepthSlot,
  {
    className: string;
    origin: string;
    rest: SlotPose;
    hover: SlotPose;
    zIndex: number;
  }
> = {
  third: {
    className:
      "left-[2%] top-[5%] w-[62%] drop-shadow-[0_0_8px_rgba(0,0,0,0.14)]",
    origin: "50% 88%",
    rest: { rotate: -11, x: "0%", y: "1%", scale: 0.86 },
    hover: { rotate: -8, x: "-3%", y: "0%", scale: 0.88 },
    zIndex: 10,
  },
  second: {
    className:
      "left-[18%] top-[7%] w-[66%] drop-shadow-[0_0_9px_rgba(0,0,0,0.16)]",
    origin: "50% 88%",
    rest: { rotate: 10, x: "0%", y: "0%", scale: 0.93 },
    hover: { rotate: 7, x: "3%", y: "-1%", scale: 0.95 },
    zIndex: 20,
  },
  top: {
    className:
      "left-[12%] top-[1%] w-[72%] drop-shadow-[0_0_10px_rgba(0,0,0,0.22)]",
    origin: "50% 100%",
    rest: { rotate: 0, x: "0%", y: "0%", scale: 1 },
    hover: { rotate: 0, x: "0%", y: "-1.5%", scale: 1.01 },
    zIndex: 30,
  },
};

function deckIndexAt(cursor: number, offset: number) {
  const len = DECK.length;
  return (((cursor + offset) % len) + len) % len;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** 0…1 — насколько жест «тянет» следующую карту наверх (Tinder depth) */
function useSwipeProgress(dragX: MotionValue<number>, stackWidth: number) {
  return useTransform(dragX, (x) => {
    const limit = Math.max(stackWidth * POSITION_THRESHOLD_RATIO, 72);
    return Math.min(Math.abs(x) / limit, 1);
  });
}

function slotVariants(slot: DepthSlot) {
  const s = SLOT_STYLE[slot];
  return {
    rest: { ...s.rest, transition: PEEK },
    hover: { ...s.hover, transition: PEEK },
  };
}

function DepthCard({
  slot,
  src,
  cardKey,
  dragX,
  stackWidth,
  morphTo,
  promoteFrom,
  enterFromDepth,
  isDragging,
}: {
  slot: DepthSlot;
  src: string;
  cardKey: string;
  dragX: MotionValue<number>;
  stackWidth: number;
  morphTo?: DepthSlot;
  promoteFrom?: DepthSlot;
  /** Новая 4-я карточка появляется сзади */
  enterFromDepth?: boolean;
  isDragging: boolean;
}) {
  const s = SLOT_STYLE[slot];
  const from = s.rest;
  const to = morphTo ? SLOT_STYLE[morphTo].rest : from;
  const progress = useSwipeProgress(dragX, stackWidth);

  const rotate = useTransform(progress, (p) => lerp(from.rotate, to.rotate, p));
  const scale = useTransform(progress, (p) => lerp(from.scale, to.scale, p));
  const y = useTransform(progress, (p) => {
    const fromY = parseFloat(from.y) || 0;
    const toY = parseFloat(to.y) || 0;
    return `${lerp(fromY, toY, p)}%`;
  });

  const promotePose = promoteFrom ? SLOT_STYLE[promoteFrom].rest : undefined;
  const enterInitial = enterFromDepth
    ? { ...s.rest, opacity: 0, scale: s.rest.scale * 0.92 }
    : promotePose ?? false;

  return (
    <motion.div
      key={cardKey}
      className={`pointer-events-none absolute ${s.className}`}
      style={
        isDragging
          ? {
              rotate,
              scale,
              y,
              transformOrigin: s.origin,
              zIndex: s.zIndex,
            }
          : { transformOrigin: s.origin, zIndex: s.zIndex }
      }
      variants={isDragging || promoteFrom || enterFromDepth ? undefined : slotVariants(slot)}
      initial={enterInitial}
      animate={{ ...s.rest, opacity: 1 }}
      transition={
        promoteFrom || enterFromDepth ? PROMOTE : { duration: 0.32, ease: EASE_SMOOTH }
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="block h-auto w-full select-none"
        draggable={false}
        decoding="async"
      />
    </motion.div>
  );
}

type ExitFlight = {
  src: string;
  exitX: number;
  direction: 1 | -1;
};

type VisionUtopiaCardsStackProps = {
  className?: string;
};

function SwipeTopCard({
  src,
  stackWidth,
  cardKey,
  dragX,
  isDragging,
  promoteOnEnter,
  onDragChange,
  onRelease,
  reduceMotion,
}: {
  src: string;
  stackWidth: number;
  cardKey: string;
  dragX: MotionValue<number>;
  isDragging: boolean;
  promoteOnEnter: boolean;
  onDragChange: (dragging: boolean) => void;
  onRelease: (exitX: number, direction: 1 | -1) => void;
  reduceMotion: boolean | null;
}) {
  const rotate = useTransform(dragX, (value) => {
    const limit = Math.max(stackWidth * 0.5, 140);
    return (value / limit) * 11;
  });
  const opacity = useTransform(dragX, (value) => {
    const t = Math.min(Math.abs(value) / Math.max(stackWidth * 0.42, 100), 1);
    return 1 - t * 0.12;
  });
  const liftY = useTransform(dragX, (value) => {
    const t = Math.min(Math.abs(value) / Math.max(stackWidth * 0.5, 120), 1);
    return -t * 6;
  });

  const slot = SLOT_STYLE.top;
  const positionThreshold = stackWidth * POSITION_THRESHOLD_RATIO;
  const fromPose = promoteOnEnter ? SLOT_STYLE.second.rest : undefined;

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      onDragChange(false);

      const { offset, velocity } = info;
      const passedDistance = Math.abs(offset.x) > positionThreshold;
      const passedVelocity = Math.abs(velocity.x) > VELOCITY_THRESHOLD;

      if (passedDistance || passedVelocity) {
        const direction = (
          passedDistance ? Math.sign(offset.x) : Math.sign(velocity.x)
        ) as 1 | -1;
        onRelease(dragX.get(), direction);
        return;
      }

      void animate(dragX, 0, SNAP_BACK);
    },
    [dragX, onDragChange, onRelease, positionThreshold],
  );

  if (reduceMotion) {
    return (
      <motion.div
        key={cardKey}
        className={`absolute cursor-pointer ${slot.className}`}
        style={{ transformOrigin: slot.origin, zIndex: slot.zIndex }}
        variants={slotVariants("top")}
        onClick={() => onRelease(0, 1)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="block h-auto w-full select-none" draggable={false} decoding="async" />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={cardKey}
      className={`absolute touch-none cursor-grab active:cursor-grabbing ${slot.className}`}
      style={{
        x: dragX,
        rotate,
        opacity,
        y: liftY,
        transformOrigin: slot.origin,
        zIndex: slot.zIndex,
      }}
      variants={isDragging ? undefined : slotVariants("top")}
      initial={fromPose ?? false}
      animate={slot.rest}
      transition={promoteOnEnter ? PROMOTE : { duration: 0 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.35}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 280, bounceDamping: 32, power: 0.28 }}
      onDragStart={() => onDragChange(true)}
      onDragEnd={handleDragEnd}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block h-auto w-full select-none" draggable={false} decoding="async" />
    </motion.div>
  );
}

function ExitingCard({
  flight,
  stackWidth,
  onDone,
}: {
  flight: ExitFlight;
  stackWidth: number;
  onDone: () => void;
}) {
  const slot = SLOT_STYLE.top;
  const exitRotate = flight.exitX * 0.08;

  return (
    <motion.div
      className={`pointer-events-none absolute ${slot.className}`}
      style={{ transformOrigin: slot.origin, zIndex: 40 }}
      initial={{
        x: flight.exitX,
        rotate: exitRotate,
        y: 0,
        opacity: 1,
      }}
      animate={{
        x: flight.direction * (stackWidth + 72),
        rotate: exitRotate + flight.direction * 14,
        y: -10,
        opacity: 0,
      }}
      transition={FLY_OUT}
      onAnimationComplete={onDone}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flight.src}
        alt=""
        className="block h-auto w-full select-none"
        draggable={false}
        decoding="async"
      />
    </motion.div>
  );
}

/** Свайп в духе Tinder / Reigns: мягкие пружины, easeOut-вылет */
export function VisionUtopiaCardsStack({ className }: VisionUtopiaCardsStackProps) {
  const reduceMotion = useReducedMotion();
  const clipRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const deckCursorRef = useRef(0);
  const dragX = useMotionValue(0);
  const [stackWidth, setStackWidth] = useState(280);
  const [stage, setStage] = useState({ width: 280, height: 281, scale: 1 });
  /** Никогда не сбрасывается — бесконечная галерея */
  const [deckCursor, setDeckCursor] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exiting, setExiting] = useState<ExitFlight | null>(null);

  deckCursorRef.current = deckCursor;

  const thirdIndex = deckIndexAt(deckCursor, 2);
  const secondIndex = deckIndexAt(deckCursor, 1);
  const topDeckIndex = deckIndexAt(deckCursor, 0);

  useEffect(() => {
    const clip = clipRef.current;
    if (!clip) return;

    const measure = () => {
      const { clientWidth: w, clientHeight: h } = clip;
      if (w <= 0 || h <= 0) return;

      let baseW = w;
      let baseH = w / STACK_ASPECT;
      if (baseH > h) {
        baseH = h;
        baseW = h * STACK_ASPECT;
      }

      const scaleW = w / (baseW * FAN_BLEED);
      const scaleH = h / (baseH * FAN_BLEED);
      const scale = Math.min(scaleW, scaleH, 1);

      setStage({ width: baseW, height: baseH, scale });
      setStackWidth(baseW * scale);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(clip);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!exiting && !isDragging) {
      dragX.set(0);
    }
  }, [deckCursor, exiting, isDragging, dragX]);

  /** Сброс exiting, если onAnimationComplete не сработал */
  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(() => setExiting(null), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [exiting]);

  const advanceDeck = useCallback(() => {
    setDeckCursor((current) => current + 1);
  }, []);

  const clearExit = useCallback(() => {
    setExiting(null);
    dragX.set(0);
  }, [dragX]);

  const handleRelease = useCallback(
    (_exitX: number, direction: 1 | -1) => {
      const cursor = deckCursorRef.current;
      const topIdx = deckIndexAt(cursor, 0);

      if (reduceMotion) {
        advanceDeck();
        dragX.set(0);
        return;
      }

      const exitX = dragX.get();
      dragX.set(0);
      setExiting({
        src: DECK[topIdx].src,
        exitX,
        direction,
      });
      advanceDeck();
    },
    [advanceDeck, dragX, reduceMotion],
  );

  const shouldPromote = deckCursor > 0;
  const hoverEnabled = !reduceMotion && !isDragging && !exiting;

  return (
    <div
      ref={clipRef}
      className={[
        "relative size-full min-h-0 min-w-0 overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex size-full items-center justify-center">
        <div
          className="relative shrink-0 will-change-transform"
          style={{
            width: stage.width,
            height: stage.height,
            transform: `scale(${stage.scale})`,
            transformOrigin: "center center",
          }}
        >
          <motion.div
            ref={stackRef}
            className="absolute inset-0"
            style={{ touchAction: "none" }}
            initial="rest"
            animate="rest"
            whileHover={hoverEnabled ? "hover" : undefined}
            variants={STACK_VARIANTS}
            aria-label="Карточки объектов — потяните влево или вправо, чтобы смахнуть"
            role="group"
          >
      <DepthCard
        cardKey={`third-${deckCursor}`}
        slot="third"
        src={DECK[thirdIndex].src}
        dragX={dragX}
        stackWidth={stackWidth}
        morphTo="second"
        enterFromDepth={deckCursor > 0}
        isDragging={isDragging}
      />

      <DepthCard
        cardKey={`second-${deckCursor}`}
        slot="second"
        src={DECK[secondIndex].src}
        dragX={dragX}
        stackWidth={stackWidth}
        morphTo="top"
        promoteFrom={deckCursor > 0 ? "third" : undefined}
        isDragging={isDragging}
      />

      <SwipeTopCard
        cardKey={`top-${deckCursor}`}
        src={DECK[topDeckIndex].src}
        stackWidth={stackWidth}
        dragX={dragX}
        isDragging={isDragging}
        promoteOnEnter={shouldPromote}
        onDragChange={setIsDragging}
        onRelease={handleRelease}
        reduceMotion={reduceMotion}
      />

      {exiting ? (
        <ExitingCard
          key={`exit-${deckCursor}`}
          flight={exiting}
          stackWidth={stackWidth}
          onDone={clearExit}
        />
      ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
