"use client";

import { useIsNavigating } from "@/components/providers/navigation-provider";

export function NavigationSpinner() {
  const isNavigating = useIsNavigating();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-9998 flex items-center justify-center transition-[opacity,backdrop-filter] duration-200"
      style={{
        opacity: isNavigating ? 1 : 0,
        backdropFilter: isNavigating ? "blur(4px)" : "blur(0px)",
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-500" />
        <p
          className="text-[12px] font-medium text-gray-400"
          style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
        >
          Loading…
        </p>
      </div>
    </div>
  );
}
