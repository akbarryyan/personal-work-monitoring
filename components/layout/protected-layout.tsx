import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { NavigationSpinner } from "@/components/ui/navigation-spinner";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa]">
      <NavigationProgress />
      <NavigationSpinner />
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
