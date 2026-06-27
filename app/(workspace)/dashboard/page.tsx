import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const statCards = [
  {
    label: "Today Tasks",
    value: "0",
    trend: "+0%",
    trendUp: true,
    hint: "vs last week",
    color: "bg-purple-500",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Overdue Tasks",
    value: "0",
    trend: "+0%",
    trendUp: false,
    hint: "vs last week",
    color: "bg-blue-500",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "In Progress",
    value: "0",
    trend: "+0%",
    trendUp: true,
    hint: "vs last week",
    color: "bg-orange-400",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
  {
    label: "Done This Week",
    value: "0",
    trend: "+0%",
    trendUp: true,
    hint: "vs last week",
    color: "bg-teal-500",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

const taskSections = [
  {
    title: "Prioritas Hari Ini",
    color: "bg-blue-500",
    items: [],
    emptyText: "Tidak ada task prioritas untuk hari ini.",
  },
  {
    title: "Task Overdue",
    color: "bg-red-500",
    items: [],
    emptyText: "Tidak ada task yang overdue.",
  },
  {
    title: "Task Blocked",
    color: "bg-orange-500",
    items: [],
    emptyText: "Tidak ada task yang terblokir.",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* Page title + breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <nav className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-400">
            <span>Home</span>
            <span>»</span>
            <span className="text-gray-600 font-medium">Dashboard</span>
          </nav>
        </div>
        <div className="text-[12px] text-gray-400">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-gray-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="mt-1 flex items-center gap-1 text-[12px]">
                  <span className={card.trendUp ? "text-green-500" : "text-red-500"}>
                    {card.trendUp ? "↑" : "↓"} {card.trend}
                  </span>
                  <span className="text-gray-400">{card.hint}</span>
                </p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Task sections */}
        <div className="space-y-4">
          {taskSections.map((section) => (
            <div key={section.title} className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                <span className={`h-2.5 w-2.5 rounded-full ${section.color}`} />
                <h2 className="text-[14px] font-semibold text-gray-900">{section.title}</h2>
                <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                  {section.items.length}
                </span>
              </div>
              <div className="p-5">
                {section.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    <p className="mt-2 text-[13px] text-gray-400">{section.emptyText}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Weekly summary sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold text-gray-900">Weekly Summary</h2>
            <p className="mt-1 text-[12px] text-gray-400">Minggu ini</p>

            <div className="mt-4 space-y-3">
              {[
                { label: "Total Tasks", value: 0, color: "bg-blue-500" },
                { label: "Completed", value: 0, color: "bg-green-500" },
                { label: "In Progress", value: 0, color: "bg-orange-400" },
                { label: "Blocked", value: 0, color: "bg-red-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-[13px] text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Progress bar placeholder */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-[12px] text-gray-400 mb-1.5">
                <span>Completion rate</span>
                <span>0%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-0 rounded-full bg-green-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold text-gray-900">Quick Actions</h2>
            <div className="mt-3 space-y-2">
              <a
                href="/tasks"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tambah Task Baru
              </a>
              <a
                href="/projects"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                Buat Project Baru
              </a>
              <a
                href="/tasks?filter=overdue"
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-[13px] font-medium text-gray-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Lihat Task Overdue
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
