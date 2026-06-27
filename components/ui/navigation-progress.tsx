"use client";

import { useEffect, useRef, useState } from "react";
import { useIsNavigating } from "@/components/providers/navigation-provider";

export function NavigationProgress() {
  const isNavigating = useIsNavigating();
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const wasNavigating = useRef(false);
  const t1 = useRef<ReturnType<typeof setTimeout>>(undefined);
  const t2 = useRef<ReturnType<typeof setTimeout>>(undefined);
  const t3 = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
    clearTimeout(t3.current);

    if (isNavigating) {
      wasNavigating.current = true;
      /* Start: appear at 10%, race to 75% */
      setOpacity(1);
      setWidth(10);
      t1.current = setTimeout(() => setWidth(75), 60);
    } else if (wasNavigating.current) {
      wasNavigating.current = false;
      /* Complete: jump to 100%, then fade out */
      setWidth(100);
      t2.current = setTimeout(() => {
        setOpacity(0);
        t3.current = setTimeout(() => setWidth(0), 280);
      }, 180);
    }
  }, [isNavigating]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-9999 h-[2.5px]"
      style={{
        background: "linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd)",
        width: `${width}%`,
        opacity,
        transition:
          "width 380ms cubic-bezier(0.4,0,0.2,1), opacity 280ms ease",
      }}
    />
  );
}
