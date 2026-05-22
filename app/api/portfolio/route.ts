import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, err } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      include: {
        task: true, // Include related task data (brief, field, difficulty)
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(portfolios);
  } catch (error) {
    console.error("GET portfolio error:", error);
    return err("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const { taskId, thumbnail, workLink, isPublic = true } = await request.json();

    if (!taskId || !thumbnail || !workLink) {
      return err("taskId, thumbnail, and workLink are required", 400);
    }

    // Verify task ownership
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      return err("Task not found or not owned by user", 403);
    }

    // Check if portfolio already exists for this task
    const existing = await prisma.portfolio.findUnique({
      where: { taskId },
    });

    if (existing) {
      return err("Portfolio already exists for this task", 400);
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        userId,
        taskId,
        thumbnail,
        workLink,
        isPublic,
      },
      include: {
        task: true,
      },
    });

    return ok(portfolio);
  } catch (error) {
    console.error("POST portfolio error:", error);
    return err("Internal server error", 500);
  }
}
