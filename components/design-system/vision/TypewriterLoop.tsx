"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface TypewriterLoopProps {
  text: string;
  className?: string;
}

type Phase = "type" | "hold-full" | "delete" | "hold-empty";

interface TypeRhythm {
  /** Множитель темпа: ниже — быстрее, выше — медленнее */
  pace: number;
  burstLeft: number;
}

interface DeleteRhythm {
  streakLeft: number;
  pace: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Задержка до следующего символа при наборе — с «человеческим» ритмом */
function nextTypeDelay(
  char: string,
  prevChar: string | undefined,
  index: number,
  rhythm: TypeRhythm,
): number {
  rhythm.pace += (Math.random() - 0.46) * 0.28;
  rhythm.pace = clamp(rhythm.pace, 0.32, 2.4);

  if (rhythm.burstLeft <= 0 && Math.random() < 0.14 && (prevChar === " " || prevChar === ",")) {
    rhythm.burstLeft = 3 + Math.floor(Math.random() * 7);
    rhythm.pace = rand(0.28, 0.45);
  }

  if (Math.random() < 0.055 && index > 4 && char !== " ") {
    return rand(240, 520);
  }

  let base: number;

  if (char === " ") {
    base = rand(110, 240);
    rhythm.pace = rand(0.75, 1.35);
    rhythm.burstLeft = 0;
  } else if (char === "?" || char === "!") {
    base = rand(130, 220);
    rhythm.burstLeft = 0;
  } else if (char === "%") {
    base = rand(95, 165);
  } else if (char === ",") {
    base = rand(100, 180);
    rhythm.burstLeft = 0;
  } else if (/[А-ЯA-ZЁ]/.test(char) && prevChar === " ") {
    base = rand(75, 145);
  } else if (rhythm.burstLeft > 0) {
    base = rand(14, 38);
    rhythm.burstLeft -= 1;
  } else if (Math.random() < 0.38) {
    base = rand(22, 52);
  } else if (Math.random() < 0.72) {
    base = rand(48, 95);
  } else {
    base = rand(90, 165);
  }

  return base * rhythm.pace * rand(0.82, 1.28);
}

/** Стирают быстрее, но тоже рывками */
function nextDeleteDelay(char: string, rhythm: DeleteRhythm): number {
  if (rhythm.streakLeft <= 0 && Math.random() < 0.1) {
    return rand(90, 210);
  }

  if (rhythm.streakLeft <= 0) {
    rhythm.streakLeft = 2 + Math.floor(Math.random() * 9);
    rhythm.pace = rand(0.22, 0.55);
  }

  rhythm.streakLeft -= 1;
  rhythm.pace += (Math.random() - 0.52) * 0.18;
  rhythm.pace = clamp(rhythm.pace, 0.18, 0.85);

  const base = char === " " ? rand(22, 42) : rand(12, 28);
  return base + rhythm.pace * rand(18, 55);
}

export function TypewriterLoop({ text, className = "" }: TypewriterLoopProps) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? text : "");
  const indexRef = useRef(0);
  const phaseRef = useRef<Phase>(reduceMotion ? "hold-full" : "type");
  const typeRhythmRef = useRef<TypeRhythm>({ pace: 1, burstLeft: 0 });
  const deleteRhythmRef = useRef<DeleteRhythm>({ streakLeft: 0, pace: 0.4 });

  useEffect(() => {
    if (reduceMotion) {
      setValue(text);
      return;
    }

    indexRef.current = 0;
    phaseRef.current = "type";
    typeRhythmRef.current = { pace: rand(0.85, 1.2), burstLeft: 0 };
    deleteRhythmRef.current = { streakLeft: 0, pace: 0.4 };
    setValue("");

    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (ms: number, fn: () => void) => {
      timer = setTimeout(fn, ms);
    };

    const tick = () => {
      const phase = phaseRef.current;

      if (phase === "type") {
        if (indexRef.current < text.length) {
          const nextIndex = indexRef.current + 1;
          const char = text[nextIndex - 1] ?? "";
          const prevChar = indexRef.current > 0 ? text[indexRef.current - 1] : undefined;

          indexRef.current = nextIndex;
          setValue(text.slice(0, nextIndex));
          schedule(
            nextTypeDelay(char, prevChar, nextIndex, typeRhythmRef.current),
            tick,
          );
          return;
        }

        phaseRef.current = "hold-full";
        schedule(rand(1800, 2400), () => {
          phaseRef.current = "delete";
          deleteRhythmRef.current = { streakLeft: 0, pace: rand(0.3, 0.5) };
          tick();
        });
        return;
      }

      if (phase === "delete") {
        if (indexRef.current > 0) {
          const removedChar = text[indexRef.current - 1] ?? "";
          indexRef.current -= 1;
          setValue(text.slice(0, indexRef.current));
          schedule(nextDeleteDelay(removedChar, deleteRhythmRef.current), tick);
          return;
        }

        phaseRef.current = "hold-empty";
        schedule(rand(550, 900), () => {
          phaseRef.current = "type";
          typeRhythmRef.current = { pace: rand(0.8, 1.15), burstLeft: 0 };
          tick();
        });
      }
    };

    schedule(rand(400, 750), tick);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [text, reduceMotion]);

  return (
    <span className={className}>
      {value}
      {!reduceMotion ? (
        <span className="vision-type-caret ml-0.5 inline-block align-middle" aria-hidden />
      ) : null}
    </span>
  );
}
