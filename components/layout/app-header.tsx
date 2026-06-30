import { createClient } from "@/lib/supabase/server";
import { FullscreenButton } from "@/components/layout/fullscreen-button";
import { NotificationBell, type AppNotification } from "@/components/layout/notification-bell";
import { UserMenu } from "@/components/layout/user-menu";

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

  /* ── Build notifications from tasks ── */
  const today = new Date().toISOString().split("T")[0];
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, due_date")
    .not("status", "in", "(done,cancelled)");

  const notifications: AppNotification[] = [];
  for (const t of tasks ?? []) {
    if (t.due_date && t.due_date < today) {
      notifications.push({ id: t.id, type: "overdue", title: t.title, due_date: t.due_date });
    } else if (t.due_date === today) {
      notifications.push({ id: t.id, type: "due_today", title: t.title, due_date: t.due_date });
    } else if (t.status === "blocked") {
      notifications.push({ id: t.id, type: "blocked", title: t.title, due_date: t.due_date });
    }
  }

  return (
    <header className="flex h-15 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6">
      {/* Status dots */}
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-blue-400" />
        <span className="h-3 w-3 rounded-full bg-gray-300" />
      </div>

      <div className="ml-auto flex items-center gap-3">

        {/* Bell */}
        <NotificationBell notifications={notifications} />

        {/* Fullscreen */}
        <FullscreenButton />

        {/* User */}
        <UserMenu user={{ name: displayName, email, initials }} />
      </div>
    </header>
  );
}
