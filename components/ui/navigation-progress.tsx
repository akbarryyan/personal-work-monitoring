"use client";

import { useEffect, useRef } from "react";
import { useIsNavigating } from "@/components/providers/navigation-provider";

export function NavigationProgress() {
  const isNavigating = useIsNavigating();
  const barRef = useRef<HTMLDivElement>(null);
  const wasNavigating = useRef(false);
  const t1 = useRef<ReturnType<typeof setTimeout>>(undefined);
  const t2 = useRef<ReturnType<typeof setTimeout>>(undefined);
  const t3 = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
    clearTimeout(t3.current);

    const bar = barRef.current;
    if (!bar) return;

    if (isNavigating) {
      wasNavigating.current = true;
      /* Start: appear at 10%, race to 75% */
      bar.style.opacity = "1";
      bar.style.width = "10%";
      t1.current = setTimeout(() => {
        if (barRef.current) barRef.current.style.width = "75%";
      }, 60);
    } else if (wasNavigating.current) {
      wasNavigating.current = false;
      /* Complete: jump to 100%, then fade out */
      bar.style.width = "100%";
      t2.current = setTimeout(() => {
        if (barRef.current) barRef.current.style.opacity = "0";
        t3.current = setTimeout(() => {
          if (barRef.current) barRef.current.style.width = "0%";
        }, 280);
      }, 180);
    }
  }, [isNavigating]);

  return (
    <div
      ref={barRef}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-9999 h-[2.5px]"
      style={{
        background: "linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd)",
        width: "0%",
        opacity: 0,
        transition:
          "width 380ms cubic-bezier(0.4,0,0.2,1), opacity 280ms ease",
      }}
    />
  );
}
