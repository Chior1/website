import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { exports, processingQueue, projects } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell active="项目">
      <div className="workspace-header">
        <div>
          <h1>工作台</h1>
          <p className="muted">统一查看项目、处理中任务、最近编辑和导出记录。</p>
        </div>
        <Link className="button primary" href="/new">
          新建任务
        </Link>
      </div>

      <div className="grid three" style={{ marginBottom: 18 }}>
        <div className="card">
          <p className="muted small">全部项目</p>
          <h2>12</h2>
        </div>
        <div className="card">
          <p className="muted small">处理中</p>
          <h2>3</h2>
        </div>
        <div className="card">
          <p className="muted small">本周导出</p>
          <h2>8</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="workspace-panel">
          <div className="section-head">
            <div>
              <h2>项目列表</h2>
              <p className="muted">音频纪要和视频字幕项目放在一起管理。</p>
            </div>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.title}>
                <div>
                  <p className="row-title">{project.title}</p>
                  <div className="meta">
                    <span>{project.type}</span>
                    <span>{project.duration}</span>
                    <span>{project.owner}</span>
                    <span>{project.updatedAt}</span>
                  </div>
                </div>
                <div className="actions">
                  <StatusBadge status={project.status} />
                  <Link className="button secondary" href={project.href}>
                    打开
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid">
          <section className="workspace-panel">
            <h2>处理中队列</h2>
            <div className="queue-list">
              {processingQueue.map((item) => (
                <div className="queue-row" key={item.name}>
                  <p className="row-title">{item.name}</p>
                  <p className="muted small">{item.step}</p>
                  <div className="progress" aria-label={`${item.progress}%`}>
                    <span style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="workspace-panel" id="exports">
            <h2>导出记录</h2>
            <div className="export-list">
              {exports.map((item) => (
                <div className="export-row" key={item.name}>
                  <p className="row-title">{item.name}</p>
                  <p className="muted small">
                    {item.type} · {item.time}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

