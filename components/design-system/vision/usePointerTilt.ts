"use client";

import { useCallback, useRef, useState } from "react";

const MAX_DEG = 5;

export function usePointerTilt(enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
  );

  const reset = useCallback(() => {
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTransform(
        `perspective(1200px) rotateX(${(-y * MAX_DEG).toFixed(2)}deg) rotateY(${(x * MAX_DEG).toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`,
      );
    },
    [enabled],
  );

  return { ref, transform, onPointerMove, onPointerLeave: reset };
}
