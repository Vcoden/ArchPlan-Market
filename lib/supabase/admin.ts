import { createClient } from "@supabase/supabase-js";
import { getServiceRoleKey, getSupabaseUrl, isSupabaseConfigured } from "./env";

export function createAdminClient() {
  if (!isSupabaseConfigured() || !getServiceRoleKey()) {
    throw new Error("Supabase service role is not configured.");
  }

  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
