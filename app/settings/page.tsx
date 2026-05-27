import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell active="设置">
      <div className="workspace-header">
        <div>
          <h1>设置与隐私</h1>
          <p className="muted">把文件删除、隐私提示和导出格式说明提前放出来。</p>
        </div>
      </div>

      <div className="grid two">
        <section className="workspace-panel">
          <h2>文件隐私</h2>
          <p className="muted">
            当前阶段不处理真实文件。后续接入真实服务前，需要明确文件保存在哪里、
            保存多久、用户如何删除。
          </p>
          <button className="button secondary" type="button">
            查看删除说明
          </button>
        </section>
        <section className="workspace-panel">
          <h2>导出格式</h2>
          <p className="muted">
            会议纪要适合导出为文档或纯文本；字幕适合导出为 SRT、VTT 或纯文本。
          </p>
          <button className="button secondary" type="button">
            查看格式说明
          </button>
        </section>
      </div>
    </AppShell>
  );
}

