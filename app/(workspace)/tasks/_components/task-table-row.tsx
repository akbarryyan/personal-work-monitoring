"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { patchTaskFieldAction } from "@/app/actions/tasks";
import { useToast } from "@/components/providers/toast-provider";

/* ── Types ── */
export type RowTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  projects: { id: string; name: string; color: string | null } | null;
};

/* ── Maps ── */
const STATUS_OPTIONS = [
  { value: "todo",        label: "Todo",        cls: "bg-gray-100 text-gray-600" },
  { value: "in_progress", label: "In Progress", cls: "bg-blue-50 text-blue-600" },
  { value: "blocked",     label: "Blocked",     cls: "bg-red-50 text-red-600" },
  { value: "review",      label: "Review",      cls: "bg-purple-50 text-purple-600" },
  { value: "done",        label: "Done",        cls: "bg-green-50 text-green-600" },
  { value: "cancelled",   label: "Cancelled",   cls: "bg-gray-100 text-gray-400" },
];

const PRIORITY_OPTIONS = [
  { value: "low",    label: "Low",    cls: "bg-gray-100 text-gray-500" },
  { value: "medium", label: "Medium", cls: "bg-yellow-50 text-yellow-700" },
  { value: "high",   label: "High",   cls: "bg-orange-50 text-orange-600" },
  { value: "urgent", label: "Urgent", cls: "bg-red-50 text-red-600" },
];

const statusOf = (v: string) =>
  STATUS_OPTIONS.find((o) => o.value === v) ?? STATUS_OPTIONS[0];
const priorityOf = (v: string) =>
  PRIORITY_OPTIONS.find((o) => o.value === v) ?? PRIORITY_OPTIONS[0];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

/* ── Hook: close on outside click ── */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

/* ── StatusCell ── */
function StatusCell({ taskId, initial }: { taskId: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();
  useClickOutside(ref, () => setOpen(false));

  const current = statusOf(value);

  function select(next: string) {
    setOpen(false);
    if (next === value) return;
    setValue(next);
    startTransition(async () => {
      const res = await patchTaskFieldAction(taskId, "status", next);
      if (res.error) toast(res.error, "error");
    });
  }

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v); }}
        className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition hover:opacity-80 ${current.cls}`}
      >
        {current.label}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-35 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); select(o.value); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition hover:bg-gray-50 ${value === o.value ? "font-semibold" : ""}`}
            >
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${o.cls}`}>
                {o.label}
              </span>
              {value === o.value && (
                <svg className="ml-auto text-blue-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PriorityCell ── */
function PriorityCell({ taskId, initial }: { taskId: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();
  useClickOutside(ref, () => setOpen(false));

  const current = priorityOf(value);

  function select(next: string) {
    setOpen(false);
    if (next === value) return;
    setValue(next);
    startTransition(async () => {
      const res = await patchTaskFieldAction(taskId, "priority", next);
      if (res.error) toast(res.error, "error");
    });
  }

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v); }}
        className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition hover:opacity-80 ${current.cls}`}
      >
        {current.label}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-32.5 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
          {PRIORITY_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); select(o.value); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left transition hover:bg-gray-50 ${value === o.value ? "font-semibold" : ""}`}
            >
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${o.cls}`}>
                {o.label}
              </span>
              {value === o.value && (
                <svg className="ml-auto text-blue-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── DueDateCell ── */
function DueDateCell({ taskId, initial }: { taskId: string; initial: string | null }) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();
  const toast = useToast();

  function commit(next: string | null) {
    setEditing(false);
    if (next === value) return;
    setValue(next);
    startTransition(async () => {
      const res = await patchTaskFieldAction(taskId, "due_date", next);
      if (res.error) toast(res.error, "error");
    });
  }

  if (editing) {
    return (
      <input
        type="date"
        autoFocus
        defaultValue={value ?? ""}
        className="h-7 w-28 rounded-lg border border-blue-400 px-1.5 text-[12px] text-gray-700 outline-none focus:ring-2 focus:ring-blue-100"
        onChange={(e) => commit(e.target.value || null)}
        onBlur={() => setEditing(false)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true); }}
      className="text-left text-[13px] text-gray-500 transition hover:text-blue-600"
    >
      {value ? (
        formatDate(value)
      ) : (
        <span className="text-[12px] text-gray-300 hover:text-blue-400">Set date</span>
      )}
    </button>
  );
}

/* ── TaskTableRow (exported) ── */
export function TaskTableRow({ task }: { task: RowTask }) {
  const project = task.projects;

  return (
    <div className="grid gap-3 px-4 py-4 transition hover:bg-gray-50 md:grid-cols-[minmax(0,2fr)_150px_130px_110px_100px] md:gap-4 md:px-5">
      {/* Title */}
      <Link href={`/tasks/${task.id}`} className="min-w-0 block">
        <p className="truncate text-[14px] font-medium text-gray-900 hover:text-blue-600 transition">
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 truncate text-[12px] text-gray-400">{task.description}</p>
        )}
      </Link>

      {/* Project */}
      <div className="flex min-w-0 items-center justify-between gap-3 md:justify-start">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-300 md:hidden">
          Project
        </span>
        <div className="flex min-w-0 items-center gap-1.5">
        {project ? (
          <>
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: project.color ?? "#94a3b8" }} />
            <span className="truncate text-[13px] text-gray-600">{project.name}</span>
          </>
        ) : (
          <span className="text-[13px] text-gray-400">—</span>
        )}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between gap-3 md:block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-300 md:hidden">
          Status
        </span>
        <StatusCell taskId={task.id} initial={task.status} />
      </div>

      {/* Priority */}
      <div className="flex items-center justify-between gap-3 md:block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-300 md:hidden">
          Priority
        </span>
        <PriorityCell taskId={task.id} initial={task.priority} />
      </div>

      {/* Due date */}
      <div className="flex items-center justify-between gap-3 md:block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-300 md:hidden">
          Due
        </span>
        <DueDateCell taskId={task.id} initial={task.due_date} />
      </div>
    </div>
  );
}
