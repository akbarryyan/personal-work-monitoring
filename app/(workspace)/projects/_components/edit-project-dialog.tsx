"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { editProjectAction, type ProjectFormState } from "@/app/actions/projects";
import { useToast } from "@/components/providers/toast-provider";

const COLOR_PRESETS = [
  "#3b82f6",
  "#8b5cf6",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#eab308",
];

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 placeholder:text-gray-400";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[12px] font-semibold text-gray-600">
      {children}
    </label>
  );
}

type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
};

const INITIAL: ProjectFormState = { error: null, success: false };

export function EditProjectDialog({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(editProjectAction, INITIAL);
  const [selectedColor, setSelectedColor] = useState(project.color ?? COLOR_PRESETS[0]);
  const toast = useToast();
  const handled = useRef(false);

  useEffect(() => {
    if (!state.success) return;
    if (handled.current) return;
    handled.current = true;
    onClose();
    toast("Project berhasil diperbarui.");
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

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-[15px] font-bold text-gray-900">Edit Project</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form action={action} className="space-y-4 px-6 py-5">
          <input type="hidden" name="id" value={project.id} />

          {state.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-600">
              {state.error}
            </div>
          )}

          {/* Name */}
          <div>
            <Label>Nama Project *</Label>
            <input
              name="name"
              type="text"
              required
              defaultValue={project.name}
              placeholder="Contoh: Kantor, Freelance, Belajar…"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Deskripsi</Label>
            <textarea
              name="description"
              rows={2}
              defaultValue={project.description ?? ""}
              placeholder="Deskripsi singkat (opsional)…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Color */}
          <div>
            <Label>Warna</Label>
            <input type="hidden" name="color" value={selectedColor} />
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className="relative h-7 w-7 rounded-full transition-transform hover:scale-110"
                  style={{ background: c }}
                >
                  {selectedColor === c && (
                    <svg
                      className="absolute inset-0 m-auto text-white"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
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
              {pending ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
