import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TaskFilters } from "./_components/task-filters";

export const metadata: Metadata = { title: "Tasks" };

/* ── Types ─────────────────────────────────────────────── */
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  projects: { id: string; name: string; color: string | null } | null;
};

/* ── Badge helpers ──────────────────────────────────────── */
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

function StatusBadge({ status }: { status: string }) {
  const { label, cls } = STATUS_MAP[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const { label, cls } = PRIORITY_MAP[priority] ?? { label: priority, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

/* ── Date helpers ───────────────────────────────────────── */
function today() {
  return new Date().toISOString().split("T")[0];
}

function weekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return {
    start: mon.toISOString().split("T")[0],
    end: sun.toISOString().split("T")[0],
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

/* ── Page ───────────────────────────────────────────────── */
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const period = typeof sp.period === "string" ? sp.period : "";

  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select("id, title, description, status, priority, due_date, projects(id, name, color)")
    .order("created_at", { ascending: false });

  /* Search */
  if (q) query = query.ilike("title", `%${q}%`);

  /* Status */
  if (status) query = query.eq("status", status);

  /* Period */
  if (period === "today") {
    query = query
      .eq("due_date", today())
      .not("status", "in", "(done,cancelled)");
  } else if (period === "this-week") {
    const { start, end } = weekRange();
    query = query
      .gte("due_date", start)
      .lte("due_date", end)
      .neq("status", "cancelled");
  } else if (period === "overdue") {
    query = query
      .lt("due_date", today())
      .not("status", "in", "(done,cancelled)");
  }

  const { data: tasks, error } = await query.returns<Task[]>();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
          <nav className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-400">
            <span>Home</span>
            <span>»</span>
            <span className="font-medium text-gray-600">Tasks</span>
          </nav>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </button>
      </div>

      <TaskFilters />

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          Gagal memuat data: {error.message}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(0,2fr)_150px_130px_110px_100px] gap-4 border-b border-gray-100 px-5 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Task</p>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Project</p>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Status</p>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Priority</p>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Due Date</p>
        </div>

        <div className="divide-y divide-gray-100">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="grid grid-cols-[minmax(0,2fr)_150px_130px_110px_100px] gap-4 px-5 py-4 transition hover:bg-gray-50"
              >
                {/* Title */}
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-gray-900">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-0.5 truncate text-[12px] text-gray-400">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Project */}
                <div className="flex items-center gap-1.5 min-w-0">
                  {task.projects ? (
                    <>
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: task.projects.color ?? "#94a3b8" }}
                      />
                      <span className="truncate text-[13px] text-gray-600">
                        {task.projects.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-[13px] text-gray-400">—</span>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <StatusBadge status={task.status} />
                </div>

                {/* Priority */}
                <div className="flex items-center">
                  <PriorityBadge priority={task.priority} />
                </div>

                {/* Due date */}
                <div className="flex items-center text-[13px] text-gray-500">
                  {task.due_date ? formatDate(task.due_date) : "—"}
                </div>
              </Link>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-[14px] font-medium text-gray-500">
                {q || status || period ? "Tidak ada task yang sesuai filter." : "Belum ada task."}
              </p>
              <p className="mt-1 text-[12px] text-gray-400">
                {q || status || period
                  ? "Coba ubah kata kunci atau filter."
                  : `Klik "New Task" untuk mulai menambah task.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
