import { AppShell } from "@/components/AppShell";
import { DashboardClient } from "@/components/DashboardClient";

export default function DashboardPage() {
  return (
    <AppShell active="项目">
      <DashboardClient />
    </AppShell>
  );
}
