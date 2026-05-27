export const supportedAudioTypes = [
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/webm",
  "audio/ogg"
] as const;

export const supportedAudioExtensions = [
  "mp3",
  "mp4",
  "mpeg",
  "mpga",
  "m4a",
  "wav",
  "webm"
] as const;

export type TranscriptionProvider = "openai";

export type ReservedTranscriptionModel =
  | "gpt-4o-mini-transcribe"
  | "gpt-4o-transcribe"
  | "gpt-4o-transcribe-diarize"
  | "whisper-1";

export type TranscriptionStatus =
  | "reserved_only"
  | "missing_api_key"
  | "processing"
  | "completed"
  | "failed";

export type TranscriptionSegment = {
  start: string;
  end: string;
  speaker?: string;
  text: string;
};

export type TranscriptionResponse = {
  status: TranscriptionStatus;
  provider: TranscriptionProvider;
  model: ReservedTranscriptionModel;
  message: string;
  text?: string;
  segments?: TranscriptionSegment[];
};

export const reservedTranscriptionContract = {
  endpoint: "/api/transcriptions/audio",
  method: "POST",
  formFields: {
    file: "音频文件，字段名固定为 file",
    language: "可选，示例 zh 或 en",
    diarization: "可选，true 表示未来需要说话人区分"
  },
  provider: "openai" satisfies TranscriptionProvider,
  defaultModel: "gpt-4o-mini-transcribe" satisfies ReservedTranscriptionModel,
  supportedExtensions: supportedAudioExtensions,
  enabled: false
};

