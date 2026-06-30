"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { updateTaskAction, type TaskFormState } from "@/app/actions/tasks";
import { useToast } from "@/components/providers/toast-provider";

type Project = { id: string; name: string; color: string | null };
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  project_id: string | null;
};

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

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function EditTaskDialog({
  task,
  projects,
  open,
  onClose,
}: {
  task: Task;
  projects: Project[];
  open: boolean;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(updateTaskAction, INITIAL);
  const toast = useToast();
  const handled = useRef(false);

  useEffect(() => {
    if (!state.success) return;
    if (handled.current) return;
    handled.current = true;
    onClose();
    toast("Task berhasil diperbarui.");
  }, [state.success, onClose, toast]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-[15px] font-bold text-gray-900">Edit Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form action={action} className="space-y-4 px-6 py-5">
          <input type="hidden" name="id" value={task.id} />

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
              defaultValue={task.title}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              rows={2}
              defaultValue={task.description ?? ""}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Project */}
          <div>
            <Label>Project</Label>
            <div className="relative">
              <select name="project_id" defaultValue={task.project_id ?? ""} className={selectClass}>
                <option value="">— Tanpa project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
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
                <select name="status" defaultValue={task.status} className={selectClass}>
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
                <select name="priority" defaultValue={task.priority} className={selectClass}>
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
              defaultValue={task.due_date ?? ""}
              className={inputClass}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {pending && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {pending ? "Menyimpan…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
