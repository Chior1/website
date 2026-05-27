import { projects, type Project, type ProjectStatus } from "@/lib/mock-data";

export const projectStorageKey = "tingmo-local-projects-v1";

export type LocalProject = Project & {
  id: string;
  fileName: string;
  fileFormat: string;
  fileSize?: string;
  fileMimeType?: string;
  progress: number;
  createdAt: string;
};

export function projectHref(id: string) {
  return `/projects/${encodeURIComponent(id)}`;
}

const seedProjects: LocalProject[] = projects.map((project, index) => ({
  ...project,
  id: `seed-${index + 1}`,
  href: projectHref(`seed-${index + 1}`),
  fileName: project.type === "音频纪要" ? "产品方案周会录音.mp3" : "课程剪辑片段.mp4",
  fileFormat: project.type === "音频纪要" ? "MP3" : "MP4",
  fileSize: "示例大小",
  fileMimeType: project.type === "音频纪要" ? "audio/mpeg" : "video/mp4",
  progress: project.status === "处理中" ? 68 : 100,
  createdAt: "示例项目"
}));

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readProjects() {
  if (!canUseStorage()) return seedProjects;

  const saved = window.localStorage.getItem(projectStorageKey);

  if (!saved) {
    window.localStorage.setItem(projectStorageKey, JSON.stringify(seedProjects));
    return seedProjects;
  }

  try {
    const parsed = JSON.parse(saved) as LocalProject[];
    const normalized = parsed.map((project) => ({
      ...project,
      href: projectHref(project.id)
    }));
    window.localStorage.setItem(projectStorageKey, JSON.stringify(normalized));
    return normalized;
  } catch {
    window.localStorage.setItem(projectStorageKey, JSON.stringify(seedProjects));
    return seedProjects;
  }
}

export function writeProjects(nextProjects: LocalProject[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(projectStorageKey, JSON.stringify(nextProjects));
}

export function createProject(input: {
  title: string;
  type: "音频纪要" | "视频字幕";
  fileName: string;
  fileFormat: string;
  fileSize?: string;
  fileMimeType?: string;
}) {
  const current = readProjects();
  const id = `local-${Date.now()}`;
  const project: LocalProject = {
    id,
    title: input.title,
    type: input.type,
    status: "处理中",
    updatedAt: "刚刚",
    duration: "待识别",
    owner: "本地演示",
    href: projectHref(id),
    fileName: input.fileName,
    fileFormat: input.fileFormat,
    fileSize: input.fileSize,
    fileMimeType: input.fileMimeType,
    progress: 24,
    createdAt: new Date().toLocaleString("zh-CN")
  };

  writeProjects([project, ...current]);
  return project;
}

export function updateProjectStatus(id: string, status: ProjectStatus) {
  const nextProjects = readProjects().map((project) =>
    project.id === id
      ? {
          ...project,
          status,
          progress: status === "已完成" ? 100 : project.progress,
          updatedAt: "刚刚"
        }
      : project
  );

  writeProjects(nextProjects);
  return nextProjects;
}

export function deleteProject(id: string) {
  const nextProjects = readProjects().filter((project) => project.id !== id);
  writeProjects(nextProjects);
  return nextProjects;
}

export function resetProjects() {
  writeProjects(seedProjects);
  return seedProjects;
}
