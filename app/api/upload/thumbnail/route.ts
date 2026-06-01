import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { ok, err } from "@/lib/response";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) return err("Unauthorized", 401);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return err("File is required", 400);
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `thumbnails/${userId}-${Date.now()}.${fileExt}`;

    const blob = await put(fileName, file, {
      access: "public",
    });

    return ok({ url: blob.url });
  } catch (error) {
    console.error("Upload thumbnail error:", error);
    return err("Internal server error", 500);
  }
}
