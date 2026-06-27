import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "@/components/layout/notification-bell";

function getInitials(name: string, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const fullName: string =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "";
  const displayName = fullName || email.split("@")[0];
  const initials = getInitials(fullName, email);

  return (
    <header className="flex h-15 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="What are you Looking For?"
          className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-16 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white placeholder:text-gray-400"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Status dots */}
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-blue-400" />
          <span className="h-3 w-3 rounded-full bg-gray-300" />
        </div>

        {/* Bell */}
        <NotificationBell />

        {/* Fullscreen */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>

        {/* User */}
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-gray-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white">
            {initials}
          </div>
          <div className="text-left">
            <p className="text-[13px] font-semibold text-gray-900 leading-tight">
              {displayName}
            </p>
            <p className="text-[11px] text-gray-400 leading-tight">{email}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
