"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { deleteProjectAction } from "@/app/actions/projects";
import { useToast } from "@/components/providers/toast-provider";
import { EditProjectDialog } from "./edit-project-dialog";

type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
};

export function ProjectCardMenu({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmDelete(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteProjectAction(project.id);
      if (res.error) {
        toast(res.error, "error");
      } else {
        toast(`Project "${project.name}" dihapus.`);
      }
    });
    setOpen(false);
    setConfirmDelete(false);
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
            setConfirmDelete(false);
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
            {confirmDelete ? (
              <div className="px-3 py-2.5">
                <p className="mb-2 text-[12px] font-medium text-gray-700">Hapus project ini?</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                    className="flex-1 rounded-lg border border-gray-200 py-1 text-[12px] font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    className="flex-1 rounded-lg bg-red-500 py-1 text-[12px] font-semibold text-white transition hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    setEditOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-gray-700 transition hover:bg-gray-50"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Project
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-red-600 transition hover:bg-red-50"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  Hapus Project
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <EditProjectDialog
        project={project}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
