"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

const IsNavigatingCtx = createContext(false);

export const useIsNavigating = () => useContext(IsNavigatingCtx);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pendingRef = useRef(false);

  const clearLoading = useCallback(() => {
    if (pendingRef.current) {
      pendingRef.current = false;
      setIsNavigating(false);
    }
  }, []);

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
      const nextUrl = new URL(href, window.location.origin);
      if (
        nextUrl.pathname === window.location.pathname &&
        nextUrl.search === window.location.search
      ) {
        return;
      }
      startLoading();
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, [startLoading]);

  return (
    <IsNavigatingCtx.Provider value={isNavigating}>
      <Suspense fallback={null}>
        <NavigationEvents onChange={clearLoading} />
      </Suspense>
      {children}
    </IsNavigatingCtx.Provider>
  );
}

function NavigationEvents({ onChange }: { onChange: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    queueMicrotask(onChange);
  }, [currentUrl, onChange]);

  return null;
}
