import Link from "next/link";
import { TopNav } from "@/components/TopNav";

const scenarios = ["会议", "访谈", "课程", "播客", "短视频", "培训资料"];

export default function Home() {
  return (
    <div className="page">
      <TopNav />
      <main>
        <section className="container hero">
          <div>
            <p className="eyebrow">音视频变成可编辑文字资产</p>
            <h1>录音做纪要，视频做字幕，一个工作台完成。</h1>
            <p className="lead">
              上传录音或视频后，先得到清楚的文字草稿，再人工校对、整理纪要、导出字幕。
              第一版用可点击原型演示完整流程，方便先确认产品结构。
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/new">
                新建处理任务
              </Link>
              <Link className="button secondary" href="/dashboard">
                查看工作台
              </Link>
            </div>
          </div>

          <div className="hero-panel">
            <div className="upload-strip">
              <Link className="upload-card" href="/audio-summary">
                <span className="upload-icon">音</span>
                <span>
                  <strong>录音生成纪要</strong>
                  <br />
                  <span className="muted small">逐字稿、说话人、摘要、待办事项</span>
                </span>
                <span className="button soft">进入</span>
              </Link>
              <Link className="upload-card" href="/video-subtitles">
                <span className="upload-icon">字</span>
                <span>
                  <strong>视频生成字幕</strong>
                  <br />
                  <span className="muted small">视频预览、时间码、字幕编辑、导出</span>
                </span>
                <span className="button soft">进入</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="container section" id="features">
          <div className="section-head">
            <div>
              <h2>两个核心入口</h2>
              <p className="muted">先把最常用的两条路线放在第一屏，减少用户选择成本。</p>
            </div>
          </div>
          <div className="grid two">
            <article className="card feature-card">
              <div>
                <div className="feature-top">
                  <span className="upload-icon">音</span>
                  <span className="pill">会议、访谈、讨论</span>
                </div>
                <h3>录音生成会议纪要</h3>
                <p className="muted">
                  展示逐字稿、发言人、会议摘要、关键结论和待办事项，让录音变成能直接检查的纪要。
                </p>
              </div>
              <Link className="button secondary" href="/audio-summary">
                查看音频纪要页
              </Link>
            </article>

            <article className="card feature-card">
              <div>
                <div className="feature-top">
                  <span className="upload-icon">字</span>
                  <span className="pill">课程、短视频、培训</span>
                </div>
                <h3>视频生成可编辑字幕</h3>
                <p className="muted">
                  用视频预览、字幕列表和时间码展示字幕草稿，先保证内容可读、可改、可导出。
                </p>
              </div>
              <Link className="button secondary" href="/video-subtitles">
                查看字幕编辑页
              </Link>
            </article>
          </div>
        </section>

        <section className="container section">
          <div className="section-head">
            <div>
              <h2>处理流程</h2>
              <p className="muted">流程不追求复杂，先让每一步状态清楚。</p>
            </div>
          </div>
          <div className="steps">
            {["上传文件", "自动处理", "人工校对", "导出结果"].map((step, index) => (
              <div className="step" key={step}>
                <span className="pill">0{index + 1}</span>
                <h3>{step}</h3>
                <p className="muted small">
                  {index === 0 && "选择录音或视频，进入对应处理流程。"}
                  {index === 1 && "显示转写、说话人、字幕时间码等处理中状态。"}
                  {index === 2 && "用户检查文字、纪要、字幕和时间信息。"}
                  {index === 3 && "下载会议纪要、逐字稿、SRT 或 VTT 字幕。"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="container section" id="privacy">
          <div className="grid two">
            <div className="card">
              <h2>适用场景</h2>
              <div className="scenario-list">
                {scenarios.map((scenario) => (
                  <span key={scenario}>{scenario}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <h2>隐私说明</h2>
              <p className="muted">
                第一版只做原型，不处理真实隐私文件。正式接入真实服务前，会单独确认文件存储、
                删除方式、服务费用和私有化需求。
              </p>
            </div>
          </div>
        </section>

        <footer className="container footer-note" id="help">
          当前是阶段 1 可点击原型：用于检查页面结构和流程，不代表已经接入真实 AI。
        </footer>
      </main>
    </div>
  );
}

