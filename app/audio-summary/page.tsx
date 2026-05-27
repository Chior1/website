import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { summary, transcript } from "@/lib/mock-data";

export default function AudioSummaryPage() {
  return (
    <AppShell active="音频纪要">
      <div className="workspace-header">
        <div>
          <h1>产品方案周会录音</h1>
          <p className="muted">示例状态：已完成转写，等待人工校对和导出。</p>
        </div>
        <div className="actions">
          <Link className="button secondary" href="/dashboard">
            返回工作台
          </Link>
          <button className="button primary" type="button">
            导出纪要
          </button>
        </div>
      </div>

      <div className="editor-grid">
        <section className="editor-panel">
          <div className="section-head">
            <div>
              <h2>完整逐字稿</h2>
              <p className="muted">说话人名称和文字在下一阶段会变成可编辑。</p>
            </div>
            <span className="badge done">置信度 92%</span>
          </div>

          <div className="transcript-list">
            {transcript.map((line, index) => (
              <article className="transcript-row" key={`${line.time}-${line.speaker}`}>
                <div>
                  <p className="timecode">{line.time}</p>
                  <p className={`speaker ${index % 2 === 0 ? "one" : "two"}`}>
                    {line.speaker}
                  </p>
                </div>
                <p>{line.text}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="grid">
          <section className="editor-panel">
            <h2>会议纪要</h2>
            <div className="summary-block">
              <h3>会议摘要</h3>
              <p className="muted">{summary.overview}</p>
            </div>
            <div className="summary-block">
              <h3>讨论主题</h3>
              <div className="scenario-list">
                {summary.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            </div>
            <div className="summary-block">
              <h3>关键结论</h3>
              {summary.decisions.map((item) => (
                <p className="muted" key={item}>
                  {item}
                </p>
              ))}
            </div>
            <div className="summary-block">
              <h3>待办事项</h3>
              {summary.todos.map((item) => (
                <p className="muted" key={item}>
                  □ {item}
                </p>
              ))}
            </div>
          </section>

          <section className="editor-panel">
            <h2>发言人时间占比</h2>
            <div className="speaker-share">
              {[
                ["发言人 1", 48],
                ["发言人 2", 34],
                ["发言人 3", 18]
              ].map(([speaker, percent]) => (
                <div className="share-line" key={speaker}>
                  <span>{speaker}</span>
                  <div className="progress">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                  <strong>{percent}%</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="editor-panel">
            <h2>会议时间轴</h2>
            <div className="timeline">
              {[
                ["00:00", "开场和目标确认", 24],
                ["08:30", "工作台结构讨论", 56],
                ["18:20", "字幕页范围确认", 76],
                ["34:10", "导出和隐私说明", 92]
              ].map(([time, label, width]) => (
                <div className="timeline-item" key={time}>
                  <span className="timecode">{time}</span>
                  <div>
                    <p className="small">{label}</p>
                    <div className="timeline-bar">
                      <span style={{ width: `${width}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

