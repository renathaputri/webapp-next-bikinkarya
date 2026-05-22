import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ok, err, notFound } from "@/lib/response";

type Params = Promise<{ username: string }>;

export async function GET(request: NextRequest, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const username = params.username;

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        field: true,
        createdAt: true,
      },
    });

    if (!user) {
      return notFound("User not found");
    }

    // Get public portfolio items
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: user.id,
        isPublic: true,
      },
      include: {
        task: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return ok({
      user,
      portfolios,
    });
  } catch (error) {
    console.error("GET public portfolio error:", error);
    return err("Internal server error", 500);
  }
}
