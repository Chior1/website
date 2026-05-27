"use client";

import { useState } from "react";

export function SettingsInteractions() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showExportHelp, setShowExportHelp] = useState(false);

  return (
    <div className="grid two">
      <section className="workspace-panel">
        <h2>文件隐私</h2>
        <p className="muted">
          当前阶段不处理真实文件。这里先演示正式产品里应该有的删除确认，避免用户误删。
        </p>

        {!showDeleteConfirm ? (
          <button
            className="button secondary"
            onClick={() => setShowDeleteConfirm(true)}
            type="button"
          >
            查看删除说明
          </button>
        ) : (
          <div className="confirm-box">
            <p className="row-title">确认删除示例文件？</p>
            <p className="muted small">
              这只是原型演示，不会删除真实文件。正式版本会清楚告诉用户文件会被删到哪里、能不能恢复。
            </p>
            <div className="row-actions">
              <button
                className="button secondary compact"
                onClick={() => setShowDeleteConfirm(false)}
                type="button"
              >
                取消
              </button>
              <button
                className="button danger compact"
                onClick={() => {
                  setDeleteMessage("示例文件已标记为删除，正式版会同步删除真实文件。");
                  setShowDeleteConfirm(false);
                }}
                type="button"
              >
                确认删除
              </button>
            </div>
          </div>
        )}

        {deleteMessage && <p className="notice">{deleteMessage}</p>}
      </section>

      <section className="workspace-panel">
        <h2>导出格式</h2>
        <p className="muted">
          会议纪要适合导出为文档或纯文本；字幕适合导出为 SRT、VTT 或纯文本。
        </p>
        <button
          className="button secondary"
          onClick={() => setShowExportHelp((visible) => !visible)}
          type="button"
        >
          查看格式说明
        </button>

        {showExportHelp && (
          <div className="confirm-box">
            <p><strong>TXT：</strong>普通文字，适合复制和归档。</p>
            <p><strong>SRT：</strong>常见字幕格式，很多剪辑软件都支持。</p>
            <p><strong>VTT：</strong>网页视频常用字幕格式。</p>
          </div>
        )}
      </section>
    </div>
  );
}

