import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditTaskButton } from "./_components/edit-task-button";

type Props = { params: Promise<{ id: string }> };

/* ── Status / Priority maps ── */
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  todo:        { label: "Todo",        cls: "bg-gray-100 text-gray-600" },
  in_progress: { label: "In Progress", cls: "bg-blue-50 text-blue-600" },
  blocked:     { label: "Blocked",     cls: "bg-red-50 text-red-600" },
  review:      { label: "Review",      cls: "bg-purple-50 text-purple-600" },
  done:        { label: "Done",        cls: "bg-green-50 text-green-600" },
  cancelled:   { label: "Cancelled",   cls: "bg-gray-100 text-gray-400" },
};

const PRIORITY_MAP: Record<string, { label: string; cls: string }> = {
  low:    { label: "Low",    cls: "bg-gray-100 text-gray-500" },
  medium: { label: "Medium", cls: "bg-yellow-50 text-yellow-700" },
  high:   { label: "High",   cls: "bg-orange-50 text-orange-600" },
  urgent: { label: "Urgent", cls: "bg-red-50 text-red-600" },
};

/* ── Helpers ── */
function formatDate(d: string | null, withTime = false) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-[12px] font-medium text-gray-400 shrink-0">{label}</span>
      <span className="text-[13px] text-gray-700 text-right">{children}</span>
    </div>
  );
}

/* ── Metadata ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select("title").eq("id", id).single();
  return { title: data?.title ?? "Task Detail" };
}

/* ── Page ── */
export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: task }, { data: projects }] = await Promise.all([
    supabase
      .from("tasks")
      .select("*, projects(id, name, color)")
      .eq("id", id)
      .single(),
    supabase.from("projects").select("id, name, color").order("name"),
  ]);

  if (!task) notFound();

  const status = STATUS_MAP[task.status] ?? { label: task.status, cls: "bg-gray-100 text-gray-600" };
  const priority = PRIORITY_MAP[task.priority] ?? { label: task.priority, cls: "bg-gray-100 text-gray-500" };
  const project = task.projects as { id: string; name: string; color: string | null } | null;

  const editTask = {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    due_date: task.due_date,
    project_id: task.project_id,
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/tasks"
          className="flex items-center gap-1.5 text-[13px] text-gray-400 transition hover:text-gray-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Tasks
        </Link>
        <span className="text-gray-300">/</span>
        <span className="max-w-65 truncate text-[13px] font-medium text-gray-700">
          {task.title}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* ── Main card ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 leading-snug">{task.title}</h1>
              {project && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: project.color ?? "#94a3b8" }}
                  />
                  <span className="text-[12px] text-gray-500">{project.name}</span>
                </div>
              )}
            </div>
            <EditTaskButton task={editTask} projects={projects ?? []} />
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${status.cls}`}>
              {status.label}
            </span>
            <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${priority.cls}`}>
              {priority.label}
            </span>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
              Description
            </h2>
            {task.description ? (
              <p className="whitespace-pre-wrap text-[14px] leading-6 text-gray-700">
                {task.description}
              </p>
            ) : (
              <p className="text-[14px] italic text-gray-400">Tidak ada deskripsi.</p>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
            Detail
          </h2>

          <MetaRow label="Status">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${status.cls}`}>
              {status.label}
            </span>
          </MetaRow>

          <MetaRow label="Priority">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${priority.cls}`}>
              {priority.label}
            </span>
          </MetaRow>

          <MetaRow label="Project">
            {project ? (
              <span className="flex items-center gap-1.5 justify-end">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: project.color ?? "#94a3b8" }}
                />
                {project.name}
              </span>
            ) : "—"}
          </MetaRow>

          <MetaRow label="Due Date">{formatDate(task.due_date)}</MetaRow>
          <MetaRow label="Started">{formatDate(task.started_at, true)}</MetaRow>
          <MetaRow label="Completed">{formatDate(task.completed_at, true)}</MetaRow>
          <MetaRow label="Created">{formatDate(task.created_at, true)}</MetaRow>
          <MetaRow label="Updated">{formatDate(task.updated_at, true)}</MetaRow>
        </div>
      </div>
    </div>
  );
}
