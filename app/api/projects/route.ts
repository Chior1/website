import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  toDbProjectType,
  toLocalProject
} from "@/lib/project-db-mappers";

function databaseUnavailable() {
  return NextResponse.json(
    {
      message:
        "Supabase 数据库连接还没有配置。请先在本地 .env 里填写 DATABASE_URL 和 DIRECT_URL。"
    },
    { status: 503 }
  );
}

function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL && process.env.DIRECT_URL);
}

export async function GET() {
  if (!hasDatabaseConfig()) return databaseUnavailable();

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ projects: projects.map(toLocalProject) });
  } catch {
    return NextResponse.json(
      { message: "读取 Supabase 项目列表失败，请检查数据库连接配置。" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!hasDatabaseConfig()) return databaseUnavailable();

  try {
    const body = (await request.json()) as {
      title?: string;
      type?: "音频纪要" | "视频字幕";
      fileName?: string;
      fileFormat?: string;
      fileSize?: string;
      fileMimeType?: string;
    };

    if (!body.title?.trim() || !body.type || !body.fileName?.trim() || !body.fileFormat?.trim()) {
      return NextResponse.json(
        { message: "创建项目失败：项目名称、类型、文件名和格式都不能为空。" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: body.title.trim(),
        type: toDbProjectType(body.type),
        fileName: body.fileName.trim(),
        fileFormat: body.fileFormat.trim(),
        fileSize: body.fileSize,
        fileMimeType: body.fileMimeType,
        duration: "待识别",
        owner: "Supabase",
        progress: 24
      }
    });

    return NextResponse.json({ project: toLocalProject(project) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "创建 Supabase 项目失败，请检查数据库连接配置。" },
      { status: 500 }
    );
  }
}
