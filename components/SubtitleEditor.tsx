"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { downloadTextFile } from "@/lib/download";
import { subtitles } from "@/lib/mock-data";
import type { LocalProject } from "@/lib/local-projects";
import { readDraft, writeDraft } from "@/lib/project-drafts";
import { addExportRecord } from "@/lib/export-records";

type SubtitleLine = {
  start: string;
  end: string;
  text: string;
};

const waveHeights = [
  24, 38, 46, 28, 56, 70, 44, 30, 62, 50, 36, 72, 58, 42, 30, 64, 76, 52, 34,
  48, 68, 42, 28, 54, 62, 46, 32, 40
];

function parseTime(time: string) {
  const [hours = "0", minutes = "0", seconds = "0"] = time.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function toSrtTime(time: string) {
  return `${time},000`;
}

function toVttTime(time: string) {
  return `${time}.000`;
}

export function SubtitleEditor({ project }: { project?: LocalProject }) {
  const [items, setItems] = useState<SubtitleLine[]>(subtitles);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [message, setMessage] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const projectDraftId = project?.id ?? "demo-video-subtitles";
  const autoSaveReadyRef = useRef(false);

  useEffect(() => {
    autoSaveReadyRef.current = false;
    const draft = readDraft(projectDraftId);

    if (draft?.kind === "subtitle") {
      setItems(draft.items);
      setDraftMessage(`已恢复 ${draft.savedAt} 保存的本地草稿。`);
    }

    const timer = window.setTimeout(() => {
      autoSaveReadyRef.current = true;
    }, 0);

    return () => window.clearTimeout(timer);
  }, [projectDraftId]);

  useEffect(() => {
    if (!autoSaveReadyRef.current) return;

    const timer = window.setTimeout(() => {
      const savedAt = new Date().toLocaleString("zh-CN");

      writeDraft(projectDraftId, {
        kind: "subtitle",
        items,
        savedAt
      });
      setDraftMessage(`已自动保存本地草稿：${savedAt}`);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [items, projectDraftId]);

  const matchCount = useMemo(() => {
    if (!searchText) return 0;
    return items.reduce((count, item) => {
      return count + (item.text.includes(searchText) ? 1 : 0);
    }, 0);
  }, [items, searchText]);

  function updateItem(index: number, updates: Partial<SubtitleLine>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item
      )
    );
  }

  function replaceAll() {
    if (!searchText) {
      setMessage("请先输入要搜索的文字。");
      return;
    }

    setItems((current) =>
      current.map((item) => ({
        ...item,
        text: item.text.split(searchText).join(replaceText)
      }))
    );
    setMessage(`已替换 ${matchCount} 条字幕。`);
  }

  function splitItem(index: number) {
    setItems((current) => {
      const target = current[index];
      const midpoint = Math.max(1, Math.floor(target.text.length / 2));
      const firstText = target.text.slice(0, midpoint).trim() || target.text;
      const secondText = target.text.slice(midpoint).trim() || "请补充字幕内容";
      const middleTime = formatTime((parseTime(target.start) + parseTime(target.end)) / 2);
      const nextItems = [...current];

      nextItems[index] = { ...target, end: middleTime, text: firstText };
      nextItems.splice(index + 1, 0, {
        start: middleTime,
        end: target.end,
        text: secondText
      });
      return nextItems;
    });
  }

  function mergeWithNext(index: number) {
    setItems((current) => {
      if (index >= current.length - 1) return current;
      const merged = {
        start: current[index].start,
        end: current[index + 1].end,
        text: `${current[index].text}${current[index + 1].text}`
      };

      return [
        ...current.slice(0, index),
        merged,
        ...current.slice(index + 2)
      ];
    });
  }

  function deleteItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function exportPlainText() {
    const fileName = `${project?.title ?? "课程剪辑字幕"}.txt`;

    downloadTextFile(
      fileName,
      items.map((item) => `${item.start}-${item.end} ${item.text}`).join("\n")
    );
    addExportRecord({
      projectId: project?.id ?? "demo-video-subtitles",
      projectTitle: project?.title ?? "课程剪辑字幕稿",
      fileName,
      type: "文字稿",
      format: "TXT"
    });
    setMessage("已导出纯文本字幕。");
  }

  function exportSrt() {
    const fileName = `${project?.title ?? "课程剪辑字幕"}.srt`;
    const content = items
      .map((item, index) =>
        [
          String(index + 1),
          `${toSrtTime(item.start)} --> ${toSrtTime(item.end)}`,
          item.text
        ].join("\n")
      )
      .join("\n\n");

    downloadTextFile(fileName, content);
    addExportRecord({
      projectId: project?.id ?? "demo-video-subtitles",
      projectTitle: project?.title ?? "课程剪辑字幕稿",
      fileName,
      type: "字幕文件",
      format: "SRT"
    });
    setMessage("已导出 SRT 字幕。");
  }

  function exportVtt() {
    const fileName = `${project?.title ?? "课程剪辑字幕"}.vtt`;
    const content = [
      "WEBVTT",
      "",
      items
        .map((item) =>
          [`${toVttTime(item.start)} --> ${toVttTime(item.end)}`, item.text].join("\n")
        )
        .join("\n\n")
    ].join("\n");

    downloadTextFile(fileName, content);
    addExportRecord({
      projectId: project?.id ?? "demo-video-subtitles",
      projectTitle: project?.title ?? "课程剪辑字幕稿",
      fileName,
      type: "字幕文件",
      format: "VTT"
    });
    setMessage("已导出 VTT 字幕。");
  }

  function saveDraft() {
    const savedAt = new Date().toLocaleString("zh-CN");

    writeDraft(projectDraftId, {
      kind: "subtitle",
      items,
      savedAt
    });
    setDraftMessage(`已保存本地草稿：${savedAt}`);
  }

  return (
    <>
      <div className="workspace-header">
        <div>
          <h1>{project?.title ?? "课程剪辑字幕稿"}</h1>
          <p className="muted">
            {project
              ? `${project.fileName} · ${project.fileFormat} · ${project.status}。当前仍使用示例字幕内容。`
              : "示例状态：已生成字幕草稿，可以编辑文字、时间码和字幕块。"}
            {" "}编辑后会自动保存到当前浏览器，也可以手动保存草稿。
          </p>
        </div>
        <div className="actions">
          <Link className="button secondary" href="/dashboard">
            返回工作台
          </Link>
          <button className="button secondary" onClick={saveDraft} type="button">
            保存草稿
          </button>
          <button className="button primary" onClick={exportSrt} type="button">
            导出字幕
          </button>
        </div>
      </div>

      {draftMessage && <p className="notice">{draftMessage}</p>}
      {message && <p className="notice">{message}</p>}

      <div className="editor-grid video">
        <section className="editor-panel">
          <div className="section-head">
            <div>
              <h2>视频预览</h2>
              <p className="muted">当前仍是占位预览，重点先检查字幕编辑流程。</p>
            </div>
            <span className="badge draft">本地编辑</span>
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
              <p className="muted">可以改时间码、改字幕文字、拆分或合并字幕块。</p>
            </div>
          </div>

          <div className="toolbar">
            <input
              className="input"
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="搜索字幕文字"
              value={searchText}
            />
            <input
              className="input"
              onChange={(event) => setReplaceText(event.target.value)}
              placeholder="替换成"
              value={replaceText}
            />
            <button className="button secondary" onClick={replaceAll} type="button">
              替换 {matchCount > 0 ? `(${matchCount})` : ""}
            </button>
          </div>

          <div className="subtitle-list">
            {items.map((subtitle, index) => (
              <article className="subtitle-row editable" key={`${subtitle.start}-${index}`}>
                <div className="time-edit">
                  <input
                    className="input timecode-input"
                    value={subtitle.start}
                    onChange={(event) => updateItem(index, { start: event.target.value })}
                    aria-label="字幕开始时间"
                  />
                  <input
                    className="input timecode-input"
                    value={subtitle.end}
                    onChange={(event) => updateItem(index, { end: event.target.value })}
                    aria-label="字幕结束时间"
                  />
                </div>
                <div>
                  <textarea
                    className="input textarea"
                    value={subtitle.text}
                    onChange={(event) => updateItem(index, { text: event.target.value })}
                  />
                  <div className="row-actions">
                    <button className="button secondary compact" onClick={() => splitItem(index)} type="button">
                      拆分
                    </button>
                    <button
                      className="button secondary compact"
                      disabled={index === items.length - 1}
                      onClick={() => mergeWithNext(index)}
                      type="button"
                    >
                      合并下一条
                    </button>
                    <button className="button secondary compact" onClick={() => deleteItem(index)} type="button">
                      删除
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="summary-block" style={{ marginTop: 14 }}>
            <h3>导出格式</h3>
            <div className="row-actions">
              <button className="button secondary compact" onClick={exportSrt} type="button">
                导出 SRT
              </button>
              <button className="button secondary compact" onClick={exportVtt} type="button">
                导出 VTT
              </button>
              <button className="button secondary compact" onClick={exportPlainText} type="button">
                导出 TXT
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
