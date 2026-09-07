function readEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function isSupabaseConfigured() {
  return Boolean(readEnv("NEXT_PUBLIC_SUPABASE_URL") && readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}

export function getSupabaseUrl() {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey() {
  return readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getServiceRoleKey() {
  return readEnv("SUPABASE_SERVICE_ROLE_KEY");
}
