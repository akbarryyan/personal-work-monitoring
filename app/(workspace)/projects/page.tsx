import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

const sampleProjects = [
  { name: "Kantor", color: "bg-blue-500", tasks: 0 },
  { name: "Freelance", color: "bg-purple-500", tasks: 0 },
  { name: "Personal", color: "bg-green-500", tasks: 0 },
  { name: "Belajar", color: "bg-orange-400", tasks: 0 },
];

export default function ProjectsPage() {
  return (
    <div className="p-6">
      {/* Page title + breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <nav className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-400">
            <span>Home</span>
            <span>»</span>
            <span className="text-gray-600 font-medium">Projects</span>
          </nav>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </button>
      </div>

      {/* Project cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sampleProjects.map((project) => (
          <div
            key={project.name}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`h-3 w-3 rounded-full ${project.color}`} />
                <h2 className="text-[15px] font-semibold text-gray-900">{project.name}</h2>
              </div>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>

            <p className="mt-3 text-[13px] leading-5 text-gray-400">
              Belum ada task. Tambah task untuk mulai tracking.
            </p>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-400">{project.tasks} tasks</span>
                <span className="font-medium text-gray-600">0% done</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full w-0 rounded-full ${project.color} transition-all`} />
              </div>
            </div>
          </div>
        ))}

        {/* Add project card */}
        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white p-5 text-gray-400 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-[13px] font-medium">New Project</span>
        </button>
      </div>
    </div>
  );
}
