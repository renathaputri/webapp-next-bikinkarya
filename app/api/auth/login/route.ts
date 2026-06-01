import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { ok, err } from "@/lib/response";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return err("Username and password are required", 400);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return err("Hmm, sepertinya username atau password kamu keliru deh. Coba dicek lagi ya!", 401);
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return err("Hmm, sepertinya username atau password kamu keliru deh. Coba dicek lagi ya!", 401);
    }

    // Set session
    await setSessionCookie({
      userId: user.id,
      username: user.username,
      field: user.field,
    });

    return ok({
      id: user.id,
      username: user.username,
      field: user.field,
    });
  } catch (error) {
    console.error("Login error:", error);
    return err("Internal server error", 500);
  }
}
