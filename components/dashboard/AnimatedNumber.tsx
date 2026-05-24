"use client";

import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  /** Меняется при переключении платформы — перезапускает анимацию даже при том же value */
  replayKey?: string | number;
}

export function AnimatedNumber({ value, className, replayKey }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const prevReplayKey = useRef(replayKey);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    const replay =
      replayKey !== undefined && replayKey !== prevReplayKey.current;

    if (replay) {
      prevReplayKey.current = replayKey;
      motionValue.set(0);
    }

    const controls = animate(motionValue, value, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    });

    return controls.stop;
  }, [value, replayKey, motionValue]);

  return <span className={className}>{display}</span>;
}
