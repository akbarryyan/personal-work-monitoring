"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

const IsNavigatingCtx = createContext(false);

export const useIsNavigating = () => useContext(IsNavigatingCtx);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const pendingRef = useRef(false);

  /* Clear loading state when route change is complete */
  useEffect(() => {
    if (pendingRef.current) {
      pendingRef.current = false;
      setIsNavigating(false);
    }
  }, [pathname]);

  /* Detect navigation start via global anchor-click listener */
  const startLoading = useCallback(() => {
    pendingRef.current = true;
    setIsNavigating(true);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>(
        "a[href]"
      );
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      /* Only internal relative links */
      if (!href || !href.startsWith("/")) return;
      if (anchor.target && anchor.target !== "_self") return;
      startLoading();
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, [startLoading]);

  return (
    <IsNavigatingCtx.Provider value={isNavigating}>
      {children}
    </IsNavigatingCtx.Provider>
  );
}
