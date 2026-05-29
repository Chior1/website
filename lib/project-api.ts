import type { LocalProject } from "@/lib/local-projects";

export type ProjectPayload = {
  title: string;
  type: "音频纪要" | "视频字幕";
  fileName: string;
  fileFormat: string;
  fileSize?: string;
  fileMimeType?: string;
};

export type ProjectApiResponse = {
  projects?: LocalProject[];
  project?: LocalProject;
  message?: string;
};

async function readError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || "后端接口暂时不可用。";
  } catch {
    return "后端接口暂时不可用。";
  }
}

export async function fetchBackendProjects() {
  const response = await fetch("/api/projects", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data = (await response.json()) as ProjectApiResponse;
  return data.projects ?? [];
}

export async function fetchBackendProject(id: string) {
  const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data = (await response.json()) as ProjectApiResponse;
  return data.project ?? null;
}

export async function createBackendProject(payload: ProjectPayload) {
  const response = await fetch("/api/projects", {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data = (await response.json()) as ProjectApiResponse;
  if (!data.project) throw new Error("后端没有返回新项目。");
  return data.project;
}

export async function updateBackendProjectStatus(
  id: string,
  status: "已完成" | "处理中" | "草稿"
) {
  const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
    body: JSON.stringify({ status }),
    headers: { "Content-Type": "application/json" },
    method: "PATCH"
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data = (await response.json()) as ProjectApiResponse;
  if (!data.project) throw new Error("后端没有返回更新后的项目。");
  return data.project;
}

export async function deleteBackendProject(id: string) {
  const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
