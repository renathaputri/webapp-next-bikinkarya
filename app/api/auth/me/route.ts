import { NextRequest } from "next/server";
import { ok, err } from "@/lib/response";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const username = request.headers.get("x-user-name");
    const field = request.headers.get("x-user-field");

    if (!userId || !username || !field) {
      return err("Not authenticated", 401);
    }

    // Fetch email from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    return ok({
      id: userId,
      username,
      field,
      email: user?.email ?? null,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return err("Internal server error", 500);
  }
}
