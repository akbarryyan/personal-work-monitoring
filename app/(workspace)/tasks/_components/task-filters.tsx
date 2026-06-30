"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

const PERIOD_OPTIONS = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "overdue", label: "Overdue" },
];

const selectClass =
  "h-9 rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer hover:border-gray-300";

function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const period = searchParams.get("period") ?? "";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/tasks?${qs}` : "/tasks");
  }

  /* Debounce search input — push to URL 350ms after user stops typing */
  useEffect(() => {
    const t = setTimeout(() => updateParam("q", query.trim()), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="mb-4 flex items-center gap-3">
      {/* Search input */}
      <div className="relative flex-1 max-w-sm">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks…"
          className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-8 text-[13px] text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Status select */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => updateParam("status", e.target.value)}
          className={selectClass}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>

      {/* Period select */}
      <div className="relative">
        <select
          value={period}
          onChange={(e) => updateParam("period", e.target.value)}
          className={selectClass}
        >
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function TaskFilters() {
  return (
    <Suspense fallback={<div className="mb-4 h-9" />}>
      <Filters />
    </Suspense>
  );
}
