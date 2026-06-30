import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TaskFilters } from "./_components/task-filters";
import { NewTaskButton } from "./_components/new-task-button";
import { TaskTableRow, type RowTask } from "./_components/task-table-row";

export const metadata: Metadata = { title: "Tasks" };
const PAGE_SIZE = 10;

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

function parsePage(value: string | string[] | undefined) {
  const page = Number(typeof value === "string" ? value : "");
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function paginationItems(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const valid = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return valid.reduce<(number | "ellipsis")[]>((items, page) => {
    const previous = items.at(-1);
    if (typeof previous === "number" && page - previous > 1) {
      items.push("ellipsis");
    }
    items.push(page);
    return items;
  }, []);
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
  const currentPage = parsePage(sp.page);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, color")
    .order("name");

  let query = supabase
    .from("tasks")
    .select("id, title, description, status, priority, due_date, projects(id, name, color)", {
      count: "exact",
    })
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

  const { data: tasks, error, count } = await query
    .range(from, to)
    .returns<RowTask[]>();

  const totalTasks = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalTasks / PAGE_SIZE));
  const firstItem = totalTasks === 0 ? 0 : from + 1;
  const lastItem = Math.min(to + 1, totalTasks);

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (period) params.set("period", period);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/tasks?${qs}` : "/tasks";
  }

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

        {totalTasks > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-gray-400">
              Showing <span className="font-medium text-gray-600">{firstItem}</span>
              {" - "}
              <span className="font-medium text-gray-600">{lastItem}</span>
              {" of "}
              <span className="font-medium text-gray-600">{totalTasks}</span> tasks
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <Link
                  href={pageHref(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage <= 1}
                  className={`flex h-8 items-center rounded-lg border px-3 text-[12px] font-medium transition ${
                    currentPage <= 1
                      ? "pointer-events-none border-gray-100 text-gray-300"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Previous
                </Link>

                {paginationItems(currentPage, totalPages).map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-8 w-8 items-center justify-center text-[12px] text-gray-300"
                    >
                      ...
                    </span>
                  ) : (
                    <Link
                      key={item}
                      href={pageHref(item)}
                      aria-current={item === currentPage ? "page" : undefined}
                      className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[12px] font-medium transition ${
                        item === currentPage
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item}
                    </Link>
                  )
                )}

                <Link
                  href={pageHref(Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage >= totalPages}
                  className={`flex h-8 items-center rounded-lg border px-3 text-[12px] font-medium transition ${
                    currentPage >= totalPages
                      ? "pointer-events-none border-gray-100 text-gray-300"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
