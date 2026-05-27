export type AudioDraft = {
  kind: "audio";
  lines: Array<{
    time: string;
    speaker: string;
    text: string;
  }>;
  overview: string;
  decisions: string[];
  todos: string[];
  savedAt: string;
};

export type SubtitleDraft = {
  kind: "subtitle";
  items: Array<{
    start: string;
    end: string;
    text: string;
  }>;
  savedAt: string;
};

export type ProjectDraft = AudioDraft | SubtitleDraft;

const draftPrefix = "tingmo-project-draft-v1:";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function draftKey(projectId: string) {
  return `${draftPrefix}${projectId}`;
}

export function readDraft(projectId: string) {
  if (!canUseStorage()) return null;

  const saved = window.localStorage.getItem(draftKey(projectId));
  if (!saved) return null;

  try {
    return JSON.parse(saved) as ProjectDraft;
  } catch {
    window.localStorage.removeItem(draftKey(projectId));
    return null;
  }
}

export function writeDraft(projectId: string, draft: ProjectDraft) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(draftKey(projectId), JSON.stringify(draft));
}

export function deleteDraft(projectId: string) {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(draftKey(projectId));
}

