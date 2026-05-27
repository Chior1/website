import type { ProjectStatus } from "@/lib/mock-data";

const statusClass: Record<ProjectStatus, string> = {
  已完成: "done",
  处理中: "processing",
  草稿: "draft"
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`badge ${statusClass[status]}`}>{status}</span>;
}

