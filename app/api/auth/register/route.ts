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

    // Strict password validation
    if (password.length < 8) {
      return err("Password must be at least 8 characters", 400);
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return err("Password must contain both letters and numbers", 400);
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

    // Create user (field is null by default as per schema)
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
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
