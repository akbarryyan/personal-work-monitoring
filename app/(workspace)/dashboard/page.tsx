import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardCalendar, type CalendarTask } from "./_components/dashboard-calendar";

export const metadata: Metadata = { title: "Dashboard" };

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

export default async function DashboardPage() {
  const supabase = await createClient();
  const todayStr = today();
  const { start: weekStart, end: weekEnd } = weekRange();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, priority, due_date")
    .order("due_date", { ascending: true });

  const all = tasks ?? [];

  const todayCount = all.filter(
    (t) => t.due_date === todayStr && t.status !== "done" && t.status !== "cancelled"
  ).length;

  const overdueCount = all.filter(
    (t) => t.due_date && t.due_date < todayStr && t.status !== "done" && t.status !== "cancelled"
  ).length;

  const inProgressCount = all.filter((t) => t.status === "in_progress").length;

  const doneThisWeek = all.filter(
    (t) => t.status === "done" && t.due_date && t.due_date >= weekStart && t.due_date <= weekEnd
  ).length;

  const weekTotal = all.filter(
    (t) => t.due_date && t.due_date >= weekStart && t.due_date <= weekEnd
  ).length;
  const weekDone = all.filter(
    (t) => t.status === "done" && t.due_date && t.due_date >= weekStart && t.due_date <= weekEnd
  ).length;
  const weekInProgress = all.filter(
    (t) => t.status === "in_progress" && t.due_date && t.due_date >= weekStart && t.due_date <= weekEnd
  ).length;
  const weekBlocked = all.filter(
    (t) => t.status === "blocked" && t.due_date && t.due_date >= weekStart && t.due_date <= weekEnd
  ).length;
  const completionPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const calendarTasks: CalendarTask[] = all.filter((t) => t.due_date) as CalendarTask[];

  const statCards = [
    {
      label: "Today Tasks",
      value: String(todayCount),
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
      value: String(overdueCount),
      color: "bg-red-500",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "In Progress",
      value: String(inProgressCount),
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
      value: String(doneThisWeek),
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
      items: all.filter((t) => t.due_date === todayStr && t.status !== "done" && t.status !== "cancelled"),
      emptyText: "Tidak ada task prioritas untuk hari ini.",
    },
    {
      title: "Task Overdue",
      color: "bg-red-500",
      items: all.filter((t) => t.due_date && t.due_date < todayStr && t.status !== "done" && t.status !== "cancelled"),
      emptyText: "Tidak ada task yang overdue.",
    },
    {
      title: "Task Blocked",
      color: "bg-orange-500",
      items: all.filter((t) => t.status === "blocked"),
      emptyText: "Tidak ada task yang terblokir.",
    },
  ];

  return (
    <div className="p-6">
      {/* Page title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <nav className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-400">
            <span>Home</span>
            <span>»</span>
            <span className="font-medium text-gray-600">Dashboard</span>
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
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
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
                ) : (
                  <div className="space-y-2">
                    {section.items.slice(0, 5).map((t) => (
                      <Link
                        key={t.id}
                        href={`/tasks/${t.id}`}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-50"
                      >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${
                          t.priority === "urgent" ? "bg-red-500"
                          : t.priority === "high" ? "bg-orange-400"
                          : t.priority === "medium" ? "bg-yellow-400"
                          : "bg-gray-300"
                        }`} />
                        <span className="min-w-0 flex-1 truncate text-[13px] text-gray-800">{t.title}</span>
                        {t.due_date && (
                          <span className="shrink-0 text-[11px] text-gray-400">
                            {new Date(t.due_date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </Link>
                    ))}
                    {section.items.length > 5 && (
                      <p className="pt-1 text-center text-[12px] text-blue-500 hover:underline">
                        <Link href="/tasks">+{section.items.length - 5} lainnya</Link>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Calendar */}
          <DashboardCalendar tasks={calendarTasks} />

          {/* Weekly summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold text-gray-900">Weekly Summary</h2>
            <p className="mt-1 text-[12px] text-gray-400">Minggu ini</p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Total Tasks", value: weekTotal, color: "bg-blue-500" },
                { label: "Completed", value: weekDone, color: "bg-green-500" },
                { label: "In Progress", value: weekInProgress, color: "bg-orange-400" },
                { label: "Blocked", value: weekBlocked, color: "bg-red-400" },
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
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-[12px] text-gray-400">
                <span>Completion rate</span>
                <span>{completionPct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
