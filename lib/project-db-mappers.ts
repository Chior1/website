import type { Project, ProjectStatus, ProjectType } from "@prisma/client";
import { projectHref, type LocalProject } from "@/lib/local-projects";

export function toDbProjectType(type: "音频纪要" | "视频字幕"): ProjectType {
  return type === "音频纪要" ? "AUDIO_SUMMARY" : "VIDEO_SUBTITLE";
}

export function fromDbProjectType(type: ProjectType) {
  return type === "AUDIO_SUMMARY" ? "音频纪要" : "视频字幕";
}

export function toDbProjectStatus(status: "已完成" | "处理中" | "草稿"): ProjectStatus {
  if (status === "已完成") return "COMPLETED";
  if (status === "草稿") return "DRAFT";
  return "PROCESSING";
}

export function fromDbProjectStatus(status: ProjectStatus) {
  if (status === "COMPLETED") return "已完成";
  if (status === "DRAFT") return "草稿";
  return "处理中";
}

function formatDate(value: Date) {
  return value.toLocaleString("zh-CN", { hour12: false });
}

export function toLocalProject(project: Project): LocalProject {
  return {
    id: project.id,
    title: project.title,
    type: fromDbProjectType(project.type),
    status: fromDbProjectStatus(project.status),
    updatedAt: formatDate(project.updatedAt),
    duration: project.duration ?? "待识别",
    owner: project.owner ?? "Supabase",
    href: projectHref(project.id),
    fileName: project.fileName,
    fileFormat: project.fileFormat,
    fileSize: project.fileSize ?? undefined,
    fileMimeType: project.fileMimeType ?? undefined,
    progress: project.progress,
    createdAt: formatDate(project.createdAt)
  };
}
