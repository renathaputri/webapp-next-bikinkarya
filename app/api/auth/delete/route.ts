import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { clearSessionCookie } from "@/lib/auth";
import { ok, err } from "@/lib/response";

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return err("Not authenticated", 401);
    }

    await prisma.user.delete({ where: { id: userId } });
    await clearSessionCookie();

    return ok({ message: "Akun berhasil dihapus" });
  } catch (error) {
    console.error("Delete account error:", error);
    return err("Internal server error", 500);
  }
}
