"use client";

import { useState } from "react";
import Link from "next/link";

export type CalendarTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string;
};

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function dotColor(status: string, dueDate: string): string {
  const today = new Date().toISOString().split("T")[0];
  if (status === "done") return "#22c55e";
  if (status === "cancelled") return "#9ca3af";
  if (status === "blocked") return "#ef4444";
  if (status === "in_progress") return "#3b82f6";
  if (dueDate < today) return "#ef4444"; // overdue
  return "#f97316"; // todo / review
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function DashboardCalendar({ tasks }: { tasks: CalendarTask[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const todayStr = now.toISOString().split("T")[0];

  // Group tasks by due_date
  const byDate = new Map<string, CalendarTask[]>();
  for (const t of tasks) {
    const list = byDate.get(t.due_date) ?? [];
    list.push(t);
    byDate.set(t.due_date, list);
  }

  const cells = buildCalendarDays(year, month);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  }

  const selectedTasks = selected ? (byDate.get(selected) ?? []) : [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-gray-900">
          {MONTHS_ID[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelected(null); }}
            className="rounded-lg px-2 py-0.5 text-[11px] font-medium text-blue-600 transition hover:bg-blue-50"
          >
            Hari ini
          </button>
          <button
            onClick={nextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAY_NAMES.map((d) => (
          <span key={d} className="text-[10px] font-semibold uppercase text-gray-400">
            {d}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) {
            return <div key={`e-${i}`} className="h-10" />;
          }
          const dateStr = toDateStr(year, month, day);
          const dayTasks = byDate.get(dateStr) ?? [];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selected;
          const hasTasks = dayTasks.length > 0;

          return (
            <button
              key={dateStr}
              onClick={() => setSelected(isSelected ? null : dateStr)}
              className={`relative flex h-10 flex-col items-center justify-start pt-1.5 text-[13px] transition rounded-lg ${
                isSelected
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {/* Today circle — ring outline, no fill, neutral */}
              {isToday ? (
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold ring-2 ring-gray-800 ${isSelected ? "bg-gray-800 text-white" : "text-gray-900"}`}>
                  {day}
                </span>
              ) : (
                <span>{day}</span>
              )}

              {/* Task dots */}
              {hasTasks && (
                <span className="mt-auto mb-1 flex items-center gap-0.5">
                  {dayTasks.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: dotColor(t.status, t.due_date) }}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] font-bold text-gray-400">+{dayTasks.length - 3}</span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date task list */}
      {selected && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            {new Date(selected + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
            {" · "}{selectedTasks.length} task
          </p>
          {selectedTasks.length === 0 ? (
            <p className="text-[12px] text-gray-400">Tidak ada task.</p>
          ) : (
            <div className="space-y-1.5">
              {selectedTasks.map((t) => (
                <Link
                  key={t.id}
                  href={`/tasks/${t.id}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-50"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: dotColor(t.status, t.due_date) }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[12px] text-gray-700">{t.title}</span>
                  <span className="shrink-0 text-[10px] capitalize text-gray-400">
                    {t.status.replace("_", " ")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
        {[
          { color: "#3b82f6", label: "In Progress" },
          { color: "#f97316", label: "Todo" },
          { color: "#ef4444", label: "Overdue / Blocked" },
          { color: "#22c55e", label: "Done" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
