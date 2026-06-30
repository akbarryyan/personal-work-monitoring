import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NewProjectButton, AddProjectCard } from "./_components/new-project-button";
import { ProjectCardMenu } from "./_components/project-card-menu";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, color, created_at")
    .order("created_at", { ascending: true });

  const { data: tasks } = await supabase
    .from("tasks")
    .select("project_id, status")
    .not("project_id", "is", null);

  /* Build per-project counts */
  type Counts = { total: number; done: number };
  const counts: Record<string, Counts> = {};
  for (const t of tasks ?? []) {
    if (!t.project_id) continue;
    if (!counts[t.project_id]) counts[t.project_id] = { total: 0, done: 0 };
    counts[t.project_id].total += 1;
    if (t.status === "done") counts[t.project_id].done += 1;
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <nav className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-400">
            <span>Home</span>
            <span>»</span>
            <span className="font-medium text-gray-600">Projects</span>
          </nav>
        </div>
        <NewProjectButton />
      </div>

      {/* Cards */}
      {projects && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-gray-600">Belum ada project</p>
          <p className="mt-1 text-[12px] text-gray-400">Klik &ldquo;New Project&rdquo; untuk membuat project pertama kamu.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {(projects ?? []).map((project) => {
            const { total = 0, done = 0 } = counts[project.id] ?? {};
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const color = project.color ?? "#94a3b8";

            return (
              <div
                key={project.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ background: color }}
                    />
                    <h2 className="truncate text-[15px] font-semibold text-gray-900">
                      {project.name}
                    </h2>
                  </div>
                  <ProjectCardMenu project={{ id: project.id, name: project.name, description: project.description, color: project.color }} />
                </div>

                <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-gray-400">
                  {project.description ?? "Belum ada deskripsi."}
                </p>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-gray-400">{total} task{total !== 1 ? "s" : ""}</span>
                    <span className="font-medium text-gray-600">{pct}% done</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <AddProjectCard />
        </div>
      )}
    </div>
  );
}
