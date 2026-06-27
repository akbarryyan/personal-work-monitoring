import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TaskFilters } from "./_components/task-filters";
import { NewTaskButton } from "./_components/new-task-button";
import { TaskTableRow, type RowTask } from "./_components/task-table-row";

export const metadata: Metadata = { title: "Tasks" };

/* ── Date helpers ── */
function today() {
  return new Date().toISOString().split("T")[0];
}

function weekRange() {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return { start: mon.toISOString().split("T")[0], end: sun.toISOString().split("T")[0] };
}

/* ── Page ── */
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

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, color")
    .order("name");

  let query = supabase
    .from("tasks")
    .select("id, title, description, status, priority, due_date, projects(id, name, color)")
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);
  if (status) query = query.eq("status", status);

  if (period === "today") {
    query = query.eq("due_date", today()).not("status", "in", "(done,cancelled)");
  } else if (period === "this-week") {
    const { start, end } = weekRange();
    query = query.gte("due_date", start).lte("due_date", end).neq("status", "cancelled");
  } else if (period === "overdue") {
    query = query.lt("due_date", today()).not("status", "in", "(done,cancelled)");
  }

  const { data: tasks, error } = await query.returns<RowTask[]>();

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
        <NewTaskButton projects={projects ?? []} />
      </div>

      <TaskFilters />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          Gagal memuat data: {error.message}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-visible">
        <div className="grid grid-cols-[minmax(0,2fr)_150px_130px_110px_100px] gap-4 border-b border-gray-100 px-5 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Task</p>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Project</p>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Status</p>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Priority</p>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Due Date</p>
        </div>

        <div className="divide-y divide-gray-100">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => <TaskTableRow key={task.id} task={task} />)
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
