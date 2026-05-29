"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  deleteExportRecord,
  deleteExportRecordsByProject,
  readExportRecords,
  resetExportRecords,
  type ExportRecord
} from "@/lib/export-records";
import { deleteDraft } from "@/lib/project-drafts";
import {
  deleteProject,
  readProjects,
  resetProjects,
  updateProjectStatus,
  type LocalProject
} from "@/lib/local-projects";
import {
  deleteBackendProject,
  fetchBackendProjects,
  updateBackendProjectStatus
} from "@/lib/project-api";

export function DashboardClient() {
  const [items, setItems] = useState<LocalProject[]>([]);
  const [exportItems, setExportItems] = useState<ExportRecord[]>([]);
  const [message, setMessage] = useState("");
  const [dataSource, setDataSource] = useState<"loading" | "backend" | "local">("loading");
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState<"全部" | "音频纪要" | "视频字幕">("全部");
  const [statusFilter, setStatusFilter] = useState<"全部" | "已完成" | "处理中" | "草稿">("全部");

  useEffect(() => {
    async function loadProjects() {
      try {
        const backendProjects = await fetchBackendProjects();
        setItems(backendProjects);
        setDataSource("backend");
        if (backendProjects.length === 0) {
          setMessage("已连接 Supabase。当前云端数据库还没有项目，可以从“新建任务”创建。");
        }
      } catch (error) {
        setItems(readProjects());
        setDataSource("local");
        setMessage(
          error instanceof Error
            ? `${error.message} 当前先显示浏览器本地演示数据。`
            : "后端暂时不可用，当前先显示浏览器本地演示数据。"
        );
      }
    }

    loadProjects();
    setExportItems(readExportRecords());
  }, []);

  const processingItems = useMemo(
    () => items.filter((project) => project.status === "处理中"),
    [items]
  );
  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return items.filter((project) => {
      const matchesKeyword =
        !normalizedKeyword ||
        project.title.toLowerCase().includes(normalizedKeyword) ||
        project.fileName.toLowerCase().includes(normalizedKeyword) ||
        project.fileFormat.toLowerCase().includes(normalizedKeyword);
      const matchesType = typeFilter === "全部" || project.type === typeFilter;
      const matchesStatus = statusFilter === "全部" || project.status === statusFilter;

      return matchesKeyword && matchesType && matchesStatus;
    });
  }, [items, keyword, statusFilter, typeFilter]);
  const exportCount = exportItems.length;

  async function markDone(project: LocalProject) {
    if (dataSource === "backend") {
      try {
        const updatedProject = await updateBackendProjectStatus(project.id, "已完成");
        setItems((current) =>
          current.map((item) => (item.id === project.id ? updatedProject : item))
        );
        setMessage(`「${project.title}」已在 Supabase 标记为完成。`);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "更新 Supabase 项目状态失败。"
        );
      }
      return;
    }

    const nextProjects = updateProjectStatus(project.id, "已完成");
    setItems(nextProjects);
    setMessage(`「${project.title}」已在本地标记为完成。`);
  }

  async function removeProject(project: LocalProject) {
    const confirmed = window.confirm(
      `确认删除「${project.title}」吗？${
        dataSource === "backend"
          ? "这会删除 Supabase 里的项目记录。"
          : "这只会删除浏览器里的本地演示数据。"
      }`
    );

    if (!confirmed) return;

    if (dataSource === "backend") {
      try {
        await deleteBackendProject(project.id);
        setItems((current) => current.filter((item) => item.id !== project.id));
        setMessage(`「${project.title}」已从 Supabase 删除。`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "删除 Supabase 项目失败。");
      }
      return;
    }

    const nextProjects = deleteProject(project.id);
    const nextExportRecords = deleteExportRecordsByProject(project.id);
    deleteDraft(project.id);
    setItems(nextProjects);
    setExportItems(nextExportRecords);
    setMessage(`「${project.title}」已删除，并已同步清理它的草稿和导出记录。`);
  }

  function restoreExamples() {
    const nextProjects = resetProjects();
    const nextExportRecords = resetExportRecords();
    setItems(nextProjects);
    setExportItems(nextExportRecords);
    setMessage("已恢复示例项目。");
  }

  function removeExportRecord(record: ExportRecord) {
    const nextRecords = deleteExportRecord(record.id);
    setExportItems(nextRecords);
    setMessage(`已删除导出记录「${record.fileName}」。`);
  }

  function clearFilters() {
    setKeyword("");
    setTypeFilter("全部");
    setStatusFilter("全部");
  }

  return (
    <>
      <div className="workspace-header">
        <div>
          <h1>工作台</h1>
          <p className="muted">
            统一查看项目、处理中任务、最近编辑和导出记录。
            {dataSource === "backend" && " 当前项目数据来自 Supabase。"}
            {dataSource === "local" && " 当前项目数据来自浏览器本地演示。"}
            {dataSource === "loading" && " 正在读取项目数据。"}
          </p>
        </div>
        <div className="actions">
          <button className="button secondary" onClick={restoreExamples} type="button">
            恢复示例
          </button>
          <Link className="button primary" href="/new">
            新建任务
          </Link>
        </div>
      </div>

      {message && <p className="notice">{message}</p>}

      <div className="grid three" style={{ marginBottom: 18 }}>
        <div className="card">
          <p className="muted small">筛选结果</p>
          <h2>{filteredItems.length}</h2>
        </div>
        <div className="card">
          <p className="muted small">处理中</p>
          <h2>{processingItems.length}</h2>
        </div>
        <div className="card">
          <p className="muted small">本地导出</p>
          <h2>{exportCount}</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="workspace-panel">
          <div className="section-head">
            <div>
              <h2>项目列表</h2>
              <p className="muted">
                新建任务会优先保存到 Supabase；如果后端未配置，会退回浏览器本地演示。
              </p>
            </div>
          </div>

          <div className="filter-bar">
            <label>
              <span className="small muted">搜索项目或文件名</span>
              <input
                className="input"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="例如：会议、mp4、客户访谈"
                value={keyword}
              />
            </label>
            <label>
              <span className="small muted">项目类型</span>
              <select
                className="input"
                onChange={(event) =>
                  setTypeFilter(event.target.value as "全部" | "音频纪要" | "视频字幕")
                }
                value={typeFilter}
              >
                <option>全部</option>
                <option>音频纪要</option>
                <option>视频字幕</option>
              </select>
            </label>
            <label>
              <span className="small muted">项目状态</span>
              <select
                className="input"
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "全部" | "已完成" | "处理中" | "草稿"
                  )
                }
                value={statusFilter}
              >
                <option>全部</option>
                <option>处理中</option>
                <option>已完成</option>
                <option>草稿</option>
              </select>
            </label>
            <button className="button secondary" onClick={clearFilters} type="button">
              清空筛选
            </button>
          </div>

          <div className="project-list">
            {filteredItems.map((project) => (
              <article className="project-row" key={project.id}>
                <div>
                  <p className="row-title">{project.title}</p>
                  <div className="meta">
                    <span>{project.type}</span>
                    <span>{project.fileFormat}</span>
                    <span>{project.fileName}</span>
                    {project.fileSize && <span>{project.fileSize}</span>}
                    <span>{project.updatedAt}</span>
                  </div>
                </div>
                <div className="actions">
                  <StatusBadge status={project.status} />
                  {project.status === "处理中" && (
                    <button
                      className="button secondary compact"
                      onClick={() => markDone(project)}
                      type="button"
                    >
                      标记完成
                    </button>
                  )}
                  <Link className="button secondary compact" href={project.href}>
                    打开
                  </Link>
                  <button
                    className="button secondary compact"
                    onClick={() => removeProject(project)}
                    type="button"
                    title="删除项目时会同步清理它的本地草稿和导出记录"
                  >
                    删除
                  </button>
                </div>
              </article>
            ))}

            {items.length === 0 && (
              <div className="empty-state">
                <p className="row-title">暂无项目</p>
                <p className="muted">点击“新建任务”创建第一个本地演示项目。</p>
              </div>
            )}

            {items.length > 0 && filteredItems.length === 0 && (
              <div className="empty-state">
                <p className="row-title">没有找到符合条件的项目</p>
                <p className="muted">可以换个关键词，或者清空筛选条件。</p>
                <button className="button secondary" onClick={clearFilters} type="button">
                  清空筛选
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="grid">
          <section className="workspace-panel">
            <h2>处理中队列</h2>
            <div className="queue-list">
              {processingItems.map((item) => (
                <div className="queue-row" key={item.id}>
                  <p className="row-title">{item.title}</p>
                  <p className="muted small">本地模拟处理中，不调用 AI</p>
                  <div className="progress" aria-label={`${item.progress}%`}>
                    <span style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
              {processingItems.length === 0 && (
                <p className="muted">当前没有处理中任务。</p>
              )}
            </div>
          </section>

          <section className="workspace-panel" id="exports">
            <div className="section-head">
              <div>
                <h2>导出记录</h2>
                <p className="muted">导出纪要或字幕后，会在这里留下本地记录，并支持删除记录。</p>
              </div>
              <button
                className="button secondary compact"
                onClick={() => {
                  const nextExportRecords = resetExportRecords();
                  setExportItems(nextExportRecords);
                  setMessage("已恢复示例导出记录。");
                }}
                type="button"
              >
                恢复示例
              </button>
            </div>
            <div className="export-list">
              {exportItems.map((item) => (
                <div className="export-row" key={item.id}>
                  <p className="row-title">{item.fileName}</p>
                  <p className="muted small">
                    {item.projectTitle} · {item.type} · {item.format} · {item.exportedAt}
                  </p>
                  <button
                    className="button secondary compact"
                    onClick={() => removeExportRecord(item)}
                    type="button"
                  >
                    删除记录
                  </button>
                </div>
              ))}
              {exportItems.length === 0 && (
              <p className="muted">当前没有导出记录。导出纪要或字幕后会显示在这里。删除项目时会同步清理相关草稿和导出记录。</p>
            )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
