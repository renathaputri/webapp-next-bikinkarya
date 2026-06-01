import { NextRequest } from "next/server";
import { generateBrief } from "@/lib/gemini";
import { ok, err } from "@/lib/response";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const { field, difficulty } = await request.json();

    if (!field || !difficulty) {
      return err("Field and difficulty are required", 400);
    }

    const brief = await generateBrief(field, difficulty);

    return ok(brief);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Generate brief error:", message);
    return err(`Failed to generate brief: ${message}`, 500);
  }
}
