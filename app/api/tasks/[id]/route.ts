import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, err, forbidden, notFound } from "@/lib/response";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const taskId = params.id;
    const { status } = await request.json();

    if (!["todo", "inprogress", "done"].includes(status)) {
      return err("Invalid status", 400);
    }

    // Verify ownership
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return notFound("Task not found");
    if (task.userId !== userId) return forbidden("Not your task");

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    return ok(updatedTask);
  } catch (error) {
    console.error("PATCH task error:", error);
    return err("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const taskId = params.id;

    // Verify ownership
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return notFound("Task not found");
    if (task.userId !== userId) return forbidden("Not your task");

    await prisma.task.delete({
      where: { id: taskId },
    });

    return ok({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE task error:", error);
    return err("Internal server error", 500);
  }
}
