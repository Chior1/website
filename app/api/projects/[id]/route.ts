import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  toDbProjectStatus,
  toLocalProject
} from "@/lib/project-db-mappers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function GET(_request: Request, context: RouteContext) {
  if (!hasDatabaseConfig()) return databaseUnavailable();

  const { id } = await context.params;

  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ message: "项目不存在或已删除。" }, { status: 404 });
    }

    return NextResponse.json({ project: toLocalProject(project) });
  } catch {
    return NextResponse.json(
      { message: "读取 Supabase 项目失败，请检查数据库连接配置。" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!hasDatabaseConfig()) return databaseUnavailable();

  const { id } = await context.params;

  try {
    const body = (await request.json()) as {
      status?: "已完成" | "处理中" | "草稿";
    };

    if (!body.status) {
      return NextResponse.json(
        { message: "更新项目失败：缺少项目状态。" },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      data: {
        status: toDbProjectStatus(body.status),
        progress: body.status === "已完成" ? 100 : undefined
      },
      where: { id }
    });

    return NextResponse.json({ project: toLocalProject(project) });
  } catch {
    return NextResponse.json(
      { message: "更新 Supabase 项目失败，项目可能不存在或数据库连接不可用。" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!hasDatabaseConfig()) return databaseUnavailable();

  const { id } = await context.params;

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "项目已删除。" });
  } catch {
    return NextResponse.json(
      { message: "删除 Supabase 项目失败，项目可能不存在或数据库连接不可用。" },
      { status: 500 }
    );
  }
}
