"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/local-projects";

const audioFormats = ["MP3", "WAV", "M4A", "AAC", "FLAC", "OGG", "WMA"];
const videoFormats = ["MP4", "MOV", "MKV", "AVI", "WEBM", "M4V", "WMV", "FLV"];

export function UploadSimulator() {
  const router = useRouter();
  const [taskType, setTaskType] = useState<"audio" | "video">("audio");
  const [projectName, setProjectName] = useState("产品方案周会录音");
  const [fileName, setFileName] = useState("产品方案周会录音.mp3");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [message, setMessage] = useState("");
  const [fileWarning, setFileWarning] = useState("");

  const selectedFormats = taskType === "audio" ? audioFormats : videoFormats;
  const typeLabel = taskType === "audio" ? "音频纪要" : "视频字幕";

  const detectedFormat = useMemo(() => {
    const extension = fileName.split(".").pop()?.toUpperCase();
    return extension && selectedFormats.includes(extension) ? extension : selectedFormats[0];
  }, [fileName, selectedFormats]);

  const isCurrentFileMatched = useMemo(() => {
    const extension = fileName.split(".").pop()?.toUpperCase();
    return Boolean(extension && selectedFormats.includes(extension));
  }, [fileName, selectedFormats]);

  function selectType(nextType: "audio" | "video") {
    setTaskType(nextType);
    if (nextType === "audio") {
      setProjectName("产品方案周会录音");
      setFileName("产品方案周会录音.mp3");
    } else {
      setProjectName("课程剪辑字幕稿");
      setFileName("课程剪辑片段.mp4");
    }
    setFileSize("");
    setFileType("");
    setFileWarning("");
    setMessage("");
  }

  function createLocalTask() {
    if (!projectName.trim()) {
      setMessage("请先填写项目名称。");
      return;
    }

    if (!isCurrentFileMatched) {
      setFileWarning(`当前文件格式和「${typeLabel}」不匹配，请换一个文件或切换任务类型。`);
      return;
    }

    createProject({
      title: projectName.trim(),
      type: typeLabel,
      fileName: fileName.trim() || "未命名文件",
      fileFormat: detectedFormat,
      fileSize: fileSize || "未读取",
      fileMimeType: fileType || "未知类型"
    });
    router.push("/dashboard");
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  }

  function previewFile(file: File) {
    const extension = file.name.split(".").pop()?.toUpperCase() ?? "";
    const matched = selectedFormats.includes(extension);

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileType(file.type || "浏览器未识别");
    if (!projectName.trim() || projectName === "产品方案周会录音" || projectName === "课程剪辑字幕稿") {
      setProjectName(file.name.replace(/\.[^/.]+$/, ""));
    }
    setFileWarning(
      matched
        ? ""
        : `当前选择的是 ${extension || "未知"} 文件，但「${typeLabel}」建议使用 ${selectedFormats.join("、")}。`
    );
    setMessage("已读取本地文件信息。文件没有上传，也没有发送给 AI。");
  }

  return (
    <div className="workspace-panel">
      <div className="section-head">
        <div>
          <h2>新建任务</h2>
          <p className="muted">
            这里会创建一个本地演示项目，会检查文件格式和当前任务类型是否匹配，但不会上传真实文件，也不会调用 AI。
          </p>
        </div>
        <span className="badge draft">本地保存</span>
      </div>

      {message && <p className="notice">{message}</p>}
      {fileWarning && <p className="warning">{fileWarning}</p>}

      <div className="grid two">
        <button
          className={`card ${taskType === "audio" ? "upload-selected" : ""}`}
          onClick={() => selectType("audio")}
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
          onClick={() => selectType("video")}
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
        <label className="file-picker">
          <span className="upload-icon">选</span>
          <span>
            <strong>选择本地文件进行预览</strong>
            <br />
            <span className="muted small">只读取文件名、大小和格式，不上传文件。</span>
          </span>
          <input
            accept={taskType === "audio" ? "audio/*" : "video/*"}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) previewFile(file);
            }}
            type="file"
          />
        </label>

        <div className="form-grid">
          <label>
            <span className="small muted">项目名称</span>
            <input
              className="input"
              onChange={(event) => setProjectName(event.target.value)}
              value={projectName}
            />
          </label>
          <label>
            <span className="small muted">文件名</span>
            <input
              className="input"
              onChange={(event) => setFileName(event.target.value)}
              value={fileName}
            />
          </label>
        </div>

        <div className="file-preview">
          <div>
            <span className="small muted">识别到的格式</span>
            <strong>{detectedFormat}</strong>
          </div>
          <div>
            <span className="small muted">文件大小</span>
            <strong>{fileSize || "未选择真实文件"}</strong>
          </div>
          <div>
            <span className="small muted">浏览器识别类型</span>
            <strong>{fileType || "未选择真实文件"}</strong>
          </div>
        </div>

        <p className="muted">当前只做本地文件预览和项目记录，不上传、不识别、不接 AI。</p>

        {!isCurrentFileMatched && (
          <p className="warning">
            文件格式和当前任务类型不匹配。你可以切换任务类型，或选择一个常见支持格式。
          </p>
        )}

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

        <button className="button primary" onClick={createLocalTask} type="button">
          创建本地任务
        </button>
      </div>
    </div>
  );
}
