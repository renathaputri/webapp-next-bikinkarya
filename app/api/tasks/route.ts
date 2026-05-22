import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, err } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(tasks);
  } catch (error) {
    console.error("GET tasks error:", error);
    return err("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const { field, difficulty, brief } = await request.json();

    if (!field || !difficulty || !brief) {
      return err("Field, difficulty, and brief are required", 400);
    }

    const task = await prisma.task.create({
      data: {
        userId,
        field,
        difficulty,
        brief,
        status: "todo",
      },
    });

    return ok(task);
  } catch (error) {
    console.error("POST task error:", error);
    return err("Internal server error", 500);
  }
}
