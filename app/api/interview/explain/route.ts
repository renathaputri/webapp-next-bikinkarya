import { NextRequest } from "next/server";
import { generateExplanation } from "@/lib/gemini";
import { ok, err } from "@/lib/response";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const { field, question } = await request.json();

    if (!field || !question) {
      return err("Field and question are required", 400);
    }

    const explanation = await generateExplanation(field, question);
    
    return ok(explanation);
  } catch (error) {
    console.error("Generate explanation error:", error);
    return err("Failed to generate explanation", 500);
  }
}
