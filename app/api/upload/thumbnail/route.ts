import { NextRequest } from "next/server";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
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
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return err("Failed to upload file", 500);
    }

    // Get public URL
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return ok({ url: data.publicUrl });
  } catch (error) {
    console.error("Upload thumbnail error:", error);
    return err("Internal server error", 500);
  }
}
