"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createTaskAction, type TaskFormState } from "@/app/actions/tasks";
import { useToast } from "@/components/providers/toast-provider";

type Project = { id: string; name: string; color: string | null };

const INITIAL: TaskFormState = { error: null, success: false };

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 placeholder:text-gray-400";

const selectClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 appearance-none";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[12px] font-semibold text-gray-600">
      {children}
    </label>
  );
}

export function NewTaskDialog({
  projects,
  open,
  onClose,
}: {
  projects: Project[];
  open: boolean;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(createTaskAction, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();
  const handled = useRef(false);

  /* Close and reset on success — guard against double-fire from onClose re-render */
  useEffect(() => {
    if (!state.success) return;
    if (handled.current) return;
    handled.current = true;
    formRef.current?.reset();
    onClose();
    toast("Task berhasil disimpan.");
  }, [state.success, onClose, toast]);

  /* Close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-[15px] font-bold text-gray-900">New Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} action={action} className="px-6 py-5 space-y-4">
          {state.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
              {state.error}
            </div>
          )}

          {/* Title */}
          <div>
            <Label>Title *</Label>
            <input
              name="title"
              type="text"
              required
              placeholder="Masukkan judul task…"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              rows={2}
              placeholder="Deskripsi singkat (opsional)…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Project */}
          <div>
            <Label>Project</Label>
            <div className="relative">
              <select name="project_id" className={selectClass}>
                <option value="">— Tanpa project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <div className="relative">
                <select name="status" defaultValue="todo" className={selectClass}>
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronIcon />
              </div>
            </div>
            <div>
              <Label>Priority</Label>
              <div className="relative">
                <select name="priority" defaultValue="medium" className={selectClass}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronIcon />
              </div>
            </div>
          </div>

          {/* Due date */}
          <div>
            <Label>Due Date</Label>
            <input
              name="due_date"
              type="date"
              className={inputClass}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-4 py-2 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {pending && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {pending ? "Menyimpan…" : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      width="13"
      height="13"
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
