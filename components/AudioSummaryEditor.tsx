"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { downloadTextFile } from "@/lib/download";
import { summary, transcript } from "@/lib/mock-data";

type TranscriptLine = {
  time: string;
  speaker: string;
  text: string;
};

export function AudioSummaryEditor() {
  const [lines, setLines] = useState<TranscriptLine[]>(transcript);
  const [overview, setOverview] = useState(summary.overview);
  const [decisions, setDecisions] = useState(summary.decisions);
  const [todos, setTodos] = useState(summary.todos);
  const [exportMessage, setExportMessage] = useState("");

  const speakerNames = useMemo(
    () => Array.from(new Set(lines.map((line) => line.speaker))),
    [lines]
  );

  function updateLine(index: number, updates: Partial<TranscriptLine>) {
    setLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...updates } : line
      )
    );
  }

  function renameSpeaker(oldName: string, newName: string) {
    setLines((current) =>
      current.map((line) =>
        line.speaker === oldName ? { ...line, speaker: newName || oldName } : line
      )
    );
  }

  function exportSummary() {
    const transcriptText = lines
      .map((line) => `[${line.time}] ${line.speaker}：${line.text}`)
      .join("\n");
    const content = [
      "产品方案周会纪要",
      "",
      "会议摘要",
      overview,
      "",
      "关键结论",
      ...decisions.map((item, index) => `${index + 1}. ${item}`),
      "",
      "待办事项",
      ...todos.map((item, index) => `${index + 1}. ${item}`),
      "",
      "完整逐字稿",
      transcriptText
    ].join("\n");

    downloadTextFile("产品方案周会纪要.txt", content);
    setExportMessage("已生成示例纪要文件，内容来自你当前编辑的文字。");
  }

  return (
    <>
      <div className="workspace-header">
        <div>
          <h1>产品方案周会录音</h1>
          <p className="muted">示例状态：已完成转写，可以在本页直接修改文字和发言人。</p>
        </div>
        <div className="actions">
          <Link className="button secondary" href="/dashboard">
            返回工作台
          </Link>
          <button className="button primary" onClick={exportSummary} type="button">
            导出纪要
          </button>
        </div>
      </div>

      {exportMessage && <p className="notice">{exportMessage}</p>}

      <div className="editor-grid">
        <section className="editor-panel">
          <div className="section-head">
            <div>
              <h2>完整逐字稿</h2>
              <p className="muted">可以修改说话人名称，也可以直接改每一句文字。</p>
            </div>
            <span className="badge done">本地可编辑</span>
          </div>

          <div className="speaker-editor">
            {speakerNames.map((speaker) => (
              <label key={speaker}>
                <span className="small muted">修改 {speaker}</span>
                <input
                  className="input"
                  defaultValue={speaker}
                  onBlur={(event) => renameSpeaker(speaker, event.target.value.trim())}
                />
              </label>
            ))}
          </div>

          <div className="transcript-list">
            {lines.map((line, index) => (
              <article className="transcript-row" key={`${line.time}-${index}`}>
                <div>
                  <p className="timecode">{line.time}</p>
                  <input
                    className={`input speaker-input ${index % 2 === 0 ? "one" : "two"}`}
                    value={line.speaker}
                    onChange={(event) =>
                      updateLine(index, { speaker: event.target.value })
                    }
                  />
                </div>
                <textarea
                  className="input textarea"
                  value={line.text}
                  onChange={(event) => updateLine(index, { text: event.target.value })}
                />
              </article>
            ))}
          </div>
        </section>

        <aside className="grid">
          <section className="editor-panel">
            <h2>会议纪要</h2>
            <div className="summary-block">
              <h3>会议摘要</h3>
              <textarea
                className="input textarea large"
                value={overview}
                onChange={(event) => setOverview(event.target.value)}
              />
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
              {decisions.map((item, index) => (
                <textarea
                  className="input textarea"
                  key={index}
                  value={item}
                  onChange={(event) =>
                    setDecisions((current) =>
                      current.map((decision, decisionIndex) =>
                        decisionIndex === index ? event.target.value : decision
                      )
                    )
                  }
                />
              ))}
            </div>
            <div className="summary-block">
              <h3>待办事项</h3>
              {todos.map((item, index) => (
                <textarea
                  className="input textarea"
                  key={index}
                  value={item}
                  onChange={(event) =>
                    setTodos((current) =>
                      current.map((todo, todoIndex) =>
                        todoIndex === index ? event.target.value : todo
                      )
                    )
                  }
                />
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
    </>
  );
}

