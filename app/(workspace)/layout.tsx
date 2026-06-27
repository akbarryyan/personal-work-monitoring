import type { ReactNode } from "react";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { NavigationProvider } from "@/components/providers/navigation-provider";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <NavigationProvider>
      <ProtectedLayout>{children}</ProtectedLayout>
    </NavigationProvider>
  );
}
