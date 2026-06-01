import { NextRequest } from "next/server";
import { ok, err } from "@/lib/response";
import { prisma } from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return err("Not authenticated", 401);
    }

    const body = await request.json();
    const { email } = body;

    // Basic email validation
    if (email !== null && email !== undefined && email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return err("Format email tidak valid", 400);
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { email: email || null },
      select: { email: true },
    });

    return ok({ email: updated.email });
  } catch (error) {
    console.error("Profile update error:", error);
    return err("Internal server error", 500);
  }
}
