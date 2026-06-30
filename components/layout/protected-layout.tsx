import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { NavigationSpinner } from "@/components/ui/navigation-spinner";

function getInitials(name: string, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export async function ProtectedLayout({ children }: ProtectedLayoutProps) {
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
    <div className="flex h-dvh overflow-hidden bg-[#f5f6fa]">
      <NavigationProgress />
      <NavigationSpinner />
      <div className="hidden md:flex">
        <AppSidebar user={{ name: displayName, email, initials }} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
