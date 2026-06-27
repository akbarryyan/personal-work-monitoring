import type { ReactNode } from "react";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { NavigationProvider } from "@/components/providers/navigation-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <NavigationProvider>
      <ToastProvider>
        <ProtectedLayout>{children}</ProtectedLayout>
      </ToastProvider>
    </NavigationProvider>
  );
}
