import { NextResponse } from "next/server";
import { reservedTranscriptionContract } from "@/lib/transcription-contract";

export async function GET() {
  return NextResponse.json({
    ...reservedTranscriptionContract,
    message:
      "这是预留接口。当前项目暂不接入 AI，等产品功能完成后再启用真实转写。"
  });
}

export async function POST() {
  return NextResponse.json(
    {
      status: "reserved_only",
      provider: reservedTranscriptionContract.provider,
      model: reservedTranscriptionContract.defaultModel,
      message:
        "音频转写接口已预留，但 AI 暂未接入。等网站功能完成后，再配置 API Key 并启用真实转写。"
    },
    { status: 501 }
  );
}
