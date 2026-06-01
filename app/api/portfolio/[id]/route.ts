import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, err, forbidden, notFound } from "@/lib/response";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const portfolioId = params.id;
    const { isPublic } = await request.json();

    if (typeof isPublic !== "boolean") {
      return err("isPublic must be a boolean", 400);
    }

    // Verify ownership
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    
    if (!portfolio) return notFound("Portfolio not found");
    if (portfolio.userId !== userId) return forbidden("Not your portfolio");

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { isPublic },
    });

    return ok(updatedPortfolio);
  } catch (error) {
    console.error("PATCH portfolio error:", error);
    return err("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const portfolioId = params.id;

    // Verify ownership
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) return notFound("Portfolio not found");
    if (portfolio.userId !== userId) return forbidden("Not your portfolio");

    await prisma.portfolio.delete({
      where: { id: portfolioId },
    });

    return ok({ deleted: true });
  } catch (error) {
    console.error("DELETE portfolio error:", error);
    return err("Internal server error", 500);
  }
}

