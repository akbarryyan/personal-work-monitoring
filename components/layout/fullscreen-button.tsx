"use client";

import { useEffect, useState } from "react";

function IconEnterFullscreen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
    </svg>
  );
}

function IconExitFullscreen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M16 3v3a2 2 0 0 0 2 2h3" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function syncFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  async function toggleFullscreen() {
    if (!document.fullscreenEnabled) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      setIsFullscreen(false);
      return;
    }

    await document.documentElement.requestFullscreen().catch(() => undefined);
    setIsFullscreen(Boolean(document.fullscreenElement));
  }

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-pressed={isFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
    >
      {isFullscreen ? <IconExitFullscreen /> : <IconEnterFullscreen />}
    </button>
  );
}
