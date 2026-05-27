import { AppShell } from "@/components/AppShell";
import { ProjectDetailClient } from "@/components/ProjectDetailClient";

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell active="项目">
      <ProjectDetailClient projectId={id} />
    </AppShell>
  );
}

