"use client";

import { useState } from "react";
import Link from "next/link";

const audioFormats = ["MP3", "WAV", "M4A", "AAC", "FLAC", "OGG", "WMA"];
const videoFormats = ["MP4", "MOV", "MKV", "AVI", "WEBM", "M4V", "WMV", "FLV"];

export function UploadSimulator() {
  const [taskType, setTaskType] = useState<"audio" | "video">("audio");
  const [fileName, setFileName] = useState("产品方案周会录音.mp3");

  const targetHref = taskType === "audio" ? "/audio-summary" : "/video-subtitles";

  return (
    <div className="workspace-panel">
      <div className="section-head">
        <div>
          <h2>新建任务</h2>
          <p className="muted">这里先用示例文件模拟上传，方便你检查流程。</p>
        </div>
        <span className="badge draft">原型模式</span>
      </div>

      <div className="grid two">
        <button
          className={`card ${taskType === "audio" ? "upload-selected" : ""}`}
          onClick={() => {
            setTaskType("audio");
            setFileName("产品方案周会录音.mp3");
          }}
          type="button"
        >
          <div className="feature-top">
            <span className="upload-icon">音</span>
            <span className="pill">会议纪要</span>
          </div>
          <h3>录音生成纪要</h3>
          <p className="muted">适合会议、访谈、讨论录音。自动展示逐字稿、发言人和纪要结构。</p>
        </button>

        <button
          className={`card ${taskType === "video" ? "upload-selected" : ""}`}
          onClick={() => {
            setTaskType("video");
            setFileName("课程剪辑片段.mp4");
          }}
          type="button"
        >
          <div className="feature-top">
            <span className="upload-icon">字</span>
            <span className="pill">视频字幕</span>
          </div>
          <h3>视频生成字幕</h3>
          <p className="muted">适合课程、短视频、培训资料。生成可编辑字幕和时间码。</p>
        </button>
      </div>

      <div className="upload-drop" style={{ marginTop: 18 }}>
        <p className="row-title">示例文件：{fileName}</p>
        <p className="muted">当前阶段不会真的上传文件，只模拟“上传后进入结果页”的体验。</p>
        <div className="format-groups" aria-label="常见文件格式">
          <div>
            <p className="small muted">常见音频格式</p>
            <div className="format-list">
              {audioFormats.map((format) => (
                <span key={format}>{format}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="small muted">常见视频格式</p>
            <div className="format-list">
              {videoFormats.map((format) => (
                <span key={format}>{format}</span>
              ))}
            </div>
          </div>
        </div>
        <Link className="button primary" href={targetHref}>
          模拟开始处理
        </Link>
      </div>
    </div>
  );
}
