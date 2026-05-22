import { createClient } from "@supabase/supabase-js";

// Service-role client for server-side storage operations only.
// Never expose this in client bundles.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const STORAGE_BUCKET = "thumbnails";
