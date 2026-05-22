import { NextRequest } from "next/server";
import { generateInterviewQuestion } from "@/lib/gemini";
import { ok, err } from "@/lib/response";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const { field } = await request.json();

    if (!field) {
      return err("Field is required", 400);
    }

    const questionData = await generateInterviewQuestion(field);
    
    return ok(questionData);
  } catch (error) {
    console.error("Generate question error:", error);
    return err("Failed to generate interview question", 500);
  }
}
