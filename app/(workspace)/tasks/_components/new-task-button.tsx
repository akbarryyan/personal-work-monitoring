"use client";

import { useState } from "react";
import { NewTaskDialog } from "./new-task-dialog";

type Project = { id: string; name: string; color: string | null };

export function NewTaskButton({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-700"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Task
      </button>

      <NewTaskDialog
        projects={projects}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
