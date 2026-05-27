import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { subtitles } from "@/lib/mock-data";

const waveHeights = [
  24, 38, 46, 28, 56, 70, 44, 30, 62, 50, 36, 72, 58, 42, 30, 64, 76, 52, 34,
  48, 68, 42, 28, 54, 62, 46, 32, 40
];

export default function VideoSubtitlesPage() {
  return (
    <AppShell active="视频字幕">
      <div className="workspace-header">
        <div>
          <h1>课程剪辑字幕稿</h1>
          <p className="muted">示例状态：已生成字幕草稿，可检查时间码和文字结构。</p>
        </div>
        <div className="actions">
          <Link className="button secondary" href="/dashboard">
            返回工作台
          </Link>
          <button className="button primary" type="button">
            导出字幕
          </button>
        </div>
      </div>

      <div className="editor-grid video">
        <section className="editor-panel">
          <div className="section-head">
            <div>
              <h2>视频预览</h2>
              <p className="muted">第一阶段使用占位预览，后续接真实视频播放器。</p>
            </div>
            <span className="badge draft">原型预览</span>
          </div>

          <div className="video-box">
            <div className="playmark">播放</div>
          </div>

          <div className="waveform" aria-label="字幕时间轴占位">
            {waveHeights.map((height, index) => (
              <span key={`${height}-${index}`} style={{ height }} />
            ))}
          </div>
        </section>

        <aside className="editor-panel">
          <div className="section-head">
            <div>
              <h2>字幕列表</h2>
              <p className="muted">下一阶段会支持真正编辑、拆分、合并和搜索替换。</p>
            </div>
          </div>
          <div className="toolbar">
            <input className="input" placeholder="搜索字幕文字" />
            <button className="button secondary" type="button">
              替换
            </button>
          </div>

          <div className="subtitle-list">
            {subtitles.map((subtitle) => (
              <article className="subtitle-row" key={`${subtitle.start}-${subtitle.end}`}>
                <div>
                  <p className="timecode">{subtitle.start}</p>
                  <p className="timecode">{subtitle.end}</p>
                </div>
                <p>{subtitle.text}</p>
              </article>
            ))}
          </div>

          <div className="summary-block" style={{ marginTop: 14 }}>
            <h3>导出格式</h3>
            <p className="muted">支持格式规划：SRT、VTT、纯文本。当前按钮只做原型展示。</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

