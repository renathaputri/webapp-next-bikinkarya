import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { ok, err } from "@/lib/response";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, password, field } = await request.json();

    if (!username || !password || !field) {
      return err("Username, password, and field are required", 400);
    }

    if (password.length < 6) {
      return err("Password must be at least 6 characters", 400);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return err("Username is already taken", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        field,
      },
    });

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
    console.error("Register error:", error);
    return err("Internal server error", 500);
  }
}
