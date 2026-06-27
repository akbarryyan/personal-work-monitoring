import type { Metadata } from "next";
import Link from "next/link";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: TaskDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Task ${id}` };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/tasks"
          className="flex items-center gap-1.5 text-[13px] text-gray-400 transition hover:text-gray-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Tasks
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-[13px] font-medium text-gray-700">Task Detail</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-[12px] font-medium text-gray-400">Task ID</p>
          <p className="mt-2 text-xl font-bold text-gray-900">{id}</p>
          <p className="mt-4 text-[13px] leading-6 text-gray-500">
            Halaman detail task. Nantinya diisi dengan data lengkap task dari Supabase berdasarkan ID.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6">
          <h2 className="text-[14px] font-semibold text-gray-900">Task Fields</h2>
          <div className="mt-3 space-y-2">
            {["Title", "Description", "Project", "Status", "Priority", "Due date", "Started at", "Completed at"].map((field) => (
              <p key={field} className="text-[13px] text-gray-400">— {field}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
