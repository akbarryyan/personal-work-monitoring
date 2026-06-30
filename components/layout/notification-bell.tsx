"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type AppNotification = {
  id: string;
  type: "overdue" | "due_today" | "blocked";
  title: string;
  due_date?: string | null;
};

const LABEL: Record<AppNotification["type"], string> = {
  overdue: "Overdue",
  due_today: "Hari ini",
  blocked: "Blocked",
};

const COLOR: Record<AppNotification["type"], { bg: string; text: string; dot: string }> = {
  overdue:   { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-500" },
  due_today: { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-400" },
  blocked:   { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
};

function formatDate(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function NotificationBell({ notifications }: { notifications: AppNotification[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = notifications.length;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white leading-none">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-[-3.25rem] top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:right-0">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
            <h3 className="text-[13px] font-semibold text-gray-900">Notifikasi</h3>
            {count > 0 && (
              <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">
                {count}
              </span>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {count === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-medium text-gray-600">Tidak ada notifikasi</p>
                  <p className="mt-0.5 text-[12px] text-gray-400">Semua task berjalan lancar!</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => {
                  const c = COLOR[n.type];
                  return (
                    <Link
                      key={n.id}
                      href={`/tasks/${n.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 transition hover:bg-gray-50"
                    >
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-gray-800">{n.title}</p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${c.bg} ${c.text}`}>
                            {LABEL[n.type]}
                          </span>
                          {formatDate(n.due_date) && (
                            <span className="text-[11px] text-gray-400">{formatDate(n.due_date)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5">
            <Link
              href="/tasks"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-[12px] font-medium text-blue-500 hover:text-blue-600"
            >
              Lihat semua task
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
