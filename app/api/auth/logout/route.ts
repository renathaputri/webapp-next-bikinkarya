import { clearSessionCookie } from "@/lib/auth";
import { ok, err } from "@/lib/response";

export async function POST() {
  try {
    await clearSessionCookie();
    return ok({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return err("Internal server error", 500);
  }
}
