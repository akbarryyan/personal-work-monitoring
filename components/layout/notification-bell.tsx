"use client";

import { useEffect, useRef, useState } from "react";

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const EmptyBellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <BellIcon />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-gray-900">Notifications</h3>
              <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-500">
                0
              </span>
            </div>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">
              Mark all read
            </button>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <EmptyBellIcon />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-gray-600">No new notifications</p>
              <p className="mt-0.5 text-[12px] text-gray-400">You&apos;re all caught up!</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5">
            <button className="w-full text-center text-[12px] font-medium text-blue-500 hover:text-blue-600">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
