export const exportRecordStorageKey = "tingmo-export-records-v1";

export type ExportRecord = {
  id: string;
  projectId: string;
  projectTitle: string;
  fileName: string;
  type: "会议纪要" | "字幕文件" | "文字稿";
  format: "TXT" | "SRT" | "VTT";
  exportedAt: string;
};

const seedExportRecords: ExportRecord[] = [
  {
    id: "seed-export-1",
    projectId: "seed-1",
    projectTitle: "产品方案周会录音",
    fileName: "产品方案周会纪要.txt",
    type: "会议纪要",
    format: "TXT",
    exportedAt: "示例记录"
  },
  {
    id: "seed-export-2",
    projectId: "seed-2",
    projectTitle: "课程剪辑字幕稿",
    fileName: "课程剪辑字幕.srt",
    type: "字幕文件",
    format: "SRT",
    exportedAt: "示例记录"
  }
];

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readExportRecords() {
  if (!canUseStorage()) return seedExportRecords;

  const saved = window.localStorage.getItem(exportRecordStorageKey);
  if (!saved) {
    window.localStorage.setItem(exportRecordStorageKey, JSON.stringify(seedExportRecords));
    return seedExportRecords;
  }

  try {
    return JSON.parse(saved) as ExportRecord[];
  } catch {
    window.localStorage.setItem(exportRecordStorageKey, JSON.stringify(seedExportRecords));
    return seedExportRecords;
  }
}

export function writeExportRecords(records: ExportRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(exportRecordStorageKey, JSON.stringify(records));
}

export function addExportRecord(record: Omit<ExportRecord, "id" | "exportedAt">) {
  const nextRecord: ExportRecord = {
    ...record,
    id: `export-${Date.now()}`,
    exportedAt: new Date().toLocaleString("zh-CN")
  };
  const nextRecords = [nextRecord, ...readExportRecords()];

  writeExportRecords(nextRecords);
  return nextRecords;
}

export function deleteExportRecord(id: string) {
  const nextRecords = readExportRecords().filter((record) => record.id !== id);
  writeExportRecords(nextRecords);
  return nextRecords;
}

export function deleteExportRecordsByProject(projectId: string) {
  const nextRecords = readExportRecords().filter(
    (record) => record.projectId !== projectId
  );
  writeExportRecords(nextRecords);
  return nextRecords;
}

export function resetExportRecords() {
  writeExportRecords(seedExportRecords);
  return seedExportRecords;
}
