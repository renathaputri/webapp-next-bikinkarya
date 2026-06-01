import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, setSessionCookie } from "@/lib/auth";
import { ok, err } from "@/lib/response";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return err("Unauthorized", 401);
    }

    const { field } = await request.json();

    if (!field || !["uiux", "graphicdesign", "digimark"].includes(field)) {
      return err("Invalid field selected", 400);
    }

    // Check if user already has a field
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return err("User not found", 404);
    }

    if (user.field) {
      return err("You have already selected a field and it cannot be changed.", 400);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { field },
    });

    // Update session
    await setSessionCookie({
      userId: updatedUser.id,
      username: updatedUser.username,
      field: updatedUser.field,
    });

    return ok({ success: true, field: updatedUser.field });
  } catch (error) {
    console.error("Onboarding error:", error);
    return err("Internal server error", 500);
  }
}
