"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AudioSummaryEditor } from "@/components/AudioSummaryEditor";
import { SubtitleEditor } from "@/components/SubtitleEditor";
import { readProjects, type LocalProject } from "@/lib/local-projects";
import { fetchBackendProject } from "@/lib/project-api";

export function ProjectDetailClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<LocalProject | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const backendProject = await fetchBackendProject(projectId);
        setProject(backendProject);
        setMessage("当前项目数据来自 Supabase。");
      } catch (error) {
        const found = readProjects().find((item) => item.id === projectId) ?? null;
        setProject(found);
        setMessage(
          found
            ? "后端暂时不可用，当前显示浏览器本地演示项目。"
            : error instanceof Error
              ? error.message
              : "项目不存在或后端暂时不可用。"
        );
      } finally {
        setLoaded(true);
      }
    }

    loadProject();
  }, [projectId]);

  if (!loaded) {
    return (
      <section className="workspace-panel">
        <h1>正在读取项目</h1>
        <p className="muted">正在读取 Supabase 项目；如果后端未配置，会尝试读取本地演示项目。</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="workspace-panel">
        <h1>项目不存在或已删除</h1>
        <p className="muted">
          {message ||
            "这个项目可能已删除，或者当前后端连接还没有配置。你可以返回工作台重新查看项目列表。"}
        </p>
        <Link className="button primary" href="/dashboard">
          返回工作台
        </Link>
      </section>
    );
  }

  if (project.type === "音频纪要") {
    return (
      <>
        {message && <p className="notice">{message}</p>}
        <AudioSummaryEditor project={project} />
      </>
    );
  }

  return (
    <>
      {message && <p className="notice">{message}</p>}
      <SubtitleEditor project={project} />
    </>
  );
}
