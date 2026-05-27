import { AppShell } from "@/components/AppShell";

const modelRows = [
  {
    name: "gpt-4o-mini-transcribe",
    position: "推荐第一步",
    use: "先验证真实音频转文字流程",
    note: "适合作为第一版真实接入入口"
  },
  {
    name: "gpt-4o-transcribe",
    position: "质量优先",
    use: "需要更高准确率时评估",
    note: "后续可以作为升级选项"
  },
  {
    name: "gpt-4o-transcribe-diarize",
    position: "说话人区分",
    use: "需要识别谁在说话时评估",
    note: "先不放进最小版本，避免复杂度过高"
  },
  {
    name: "whisper-1",
    position: "兼容备选",
    use: "需要传统输出格式时评估",
    note: "不是当前第一推荐"
  }
];

const checks = [
  "是否允许文件发送到第三方 AI 服务处理",
  "是否长期保存用户上传的原始文件",
  "单个文件最大允许多大",
  "失败时页面如何提示用户",
  "没有 API Key 时是否给出大白话说明",
  "是否先只做音频，不做视频"
];

export default function IntegrationReviewPage() {
  return (
    <AppShell active="真实接入">
      <div className="workspace-header">
        <div>
          <h1>真实音频处理接入评审</h1>
          <p className="muted">
            这一页不是正式接入 AI，而是先把技术路线、费用、隐私和最小范围说清楚。
          </p>
        </div>
        <span className="badge processing">阶段 3 评审</span>
      </div>

      <div className="dashboard-grid">
        <section className="workspace-panel">
          <h2>推荐路线</h2>
          <p className="muted">
            先保留接口，不接入 AI。等网站功能整体完成后，再最后启用真实转写。
          </p>

          <div className="summary-block">
            <h3>当前状态</h3>
            <p className="muted">
              已预留 <strong>/api/transcriptions/audio</strong>，当前暂不接入 AI。
              它只返回占位提示，不会调用 AI，也不会产生费用。
            </p>
          </div>

          <div className="project-list">
            {modelRows.map((row) => (
              <article className="project-row" key={row.name}>
                <div>
                  <p className="row-title">{row.name}</p>
                  <div className="meta">
                    <span>{row.use}</span>
                    <span>{row.note}</span>
                  </div>
                </div>
                <span className="badge draft">{row.position}</span>
              </article>
            ))}
          </div>
        </section>

        <aside className="grid">
          <section className="workspace-panel">
            <h2>最小版本只做什么</h2>
            <div className="summary-block">
              <h3>现在做</h3>
              <p className="muted">保留接口地址、请求字段和返回格式，页面继续使用假数据和本地编辑。</p>
            </div>
            <div className="summary-block">
              <h3>最后再做</h3>
              <p className="muted">接入真实 AI、处理真实文件、配置 API Key、产生真实转写结果。</p>
            </div>
          </section>

          <section className="workspace-panel">
            <h2>上线前必须确认</h2>
            <div className="export-list">
              {checks.map((item) => (
                <div className="export-row" key={item}>
                  <p className="row-title">□ {item}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
