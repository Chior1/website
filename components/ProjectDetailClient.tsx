"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AudioSummaryEditor } from "@/components/AudioSummaryEditor";
import { SubtitleEditor } from "@/components/SubtitleEditor";
import { readProjects, type LocalProject } from "@/lib/local-projects";

export function ProjectDetailClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<LocalProject | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const found = readProjects().find((item) => item.id === projectId) ?? null;
    setProject(found);
    setLoaded(true);
  }, [projectId]);

  if (!loaded) {
    return (
      <section className="workspace-panel">
        <h1>正在读取项目</h1>
        <p className="muted">正在从当前浏览器读取本地项目。</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="workspace-panel">
        <h1>项目不存在或已删除</h1>
        <p className="muted">
          这个项目只保存在当前浏览器里。如果清理过浏览器数据，或者在工作台删除过项目，就会看不到。
        </p>
        <Link className="button primary" href="/dashboard">
          返回工作台
        </Link>
      </section>
    );
  }

  if (project.type === "音频纪要") {
    return <AudioSummaryEditor project={project} />;
  }

  return <SubtitleEditor project={project} />;
}

