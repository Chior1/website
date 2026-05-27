export type ProjectStatus = "已完成" | "处理中" | "草稿";

export type Project = {
  title: string;
  type: "音频纪要" | "视频字幕";
  status: ProjectStatus;
  updatedAt: string;
  duration: string;
  owner: string;
  href: string;
};

export const projects: Project[] = [
  {
    title: "产品方案周会录音",
    type: "音频纪要",
    status: "已完成",
    updatedAt: "今天 10:24",
    duration: "46 分钟",
    owner: "项目组",
    href: "/audio-summary"
  },
  {
    title: "课程剪辑字幕稿",
    type: "视频字幕",
    status: "草稿",
    updatedAt: "昨天 18:10",
    duration: "12 分钟",
    owner: "内容组",
    href: "/video-subtitles"
  },
  {
    title: "客户访谈录音",
    type: "音频纪要",
    status: "处理中",
    updatedAt: "处理中",
    duration: "31 分钟",
    owner: "调研组",
    href: "/audio-summary"
  }
];

export const processingQueue = [
  { name: "客户访谈录音", step: "正在区分不同发言人", progress: 68 },
  { name: "短视频口播素材", step: "正在生成字幕时间码", progress: 42 },
  { name: "培训录音第 2 段", step: "正在整理会议摘要", progress: 84 }
];

export const exports = [
  { name: "产品方案周会纪要.docx", type: "会议纪要", time: "今天 10:40" },
  { name: "课程剪辑字幕.srt", type: "字幕文件", time: "昨天 18:24" },
  { name: "客户访谈逐字稿.txt", type: "文字稿", time: "周一 16:05" }
];

export const transcript = [
  {
    time: "00:01",
    speaker: "发言人 1",
    text: "今天我们先确认首页和工作台的主流程，重点是让第一次使用的人知道下一步要做什么。"
  },
  {
    time: "03:18",
    speaker: "发言人 2",
    text: "音频纪要页需要把逐字稿和总结放在一起，用户一边校对文字，一边确认会议结论。"
  },
  {
    time: "08:42",
    speaker: "发言人 1",
    text: "字幕编辑器第一版先保证文字和时间码可以看清楚，不做复杂样式。"
  },
  {
    time: "15:06",
    speaker: "发言人 3",
    text: "导出格式要提前说明，用户要知道什么时候下载纪要，什么时候下载字幕。"
  }
];

export const summary = {
  overview:
    "本次会议确认了音视频工具站第一版的方向：先做可点击原型，重点验证首页入口、工作台、音频纪要页和视频字幕页是否顺畅。",
  topics: ["首页双入口", "统一工作台", "音频纪要编辑", "视频字幕编辑", "导出格式说明"],
  decisions: [
    "第一版不接真实 AI 服务，先用假数据模拟完整流程。",
    "页面整体使用白色系，强调清楚、稳定、好阅读。",
    "复杂字幕样式、翻译、多轨道编辑不进入第一版。"
  ],
  todos: [
    "完成 Next.js 页面原型。",
    "确认工作台信息是否够清楚。",
    "用户审核通过后，再进入本地交互增强阶段。"
  ]
};

export const subtitles = [
  {
    start: "00:00:01",
    end: "00:00:04",
    text: "欢迎来到这段课程，我们先看如何上传视频。"
  },
  {
    start: "00:00:05",
    end: "00:00:09",
    text: "系统会自动提取声音，并生成带时间的字幕草稿。"
  },
  {
    start: "00:00:10",
    end: "00:00:14",
    text: "你可以在右侧修改文字，也可以调整字幕出现的时间。"
  },
  {
    start: "00:00:15",
    end: "00:00:19",
    text: "确认完成后，可以导出 SRT、VTT 或普通文本。"
  }
];

