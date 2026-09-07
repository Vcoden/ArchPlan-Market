import { createAdminClient } from "@/lib/supabase/admin";
import { STORAGE_BUCKETS } from "@/lib/constants";

const DOWNLOAD_TTL_SECONDS = 60;

export async function createPlanFileSignedUrl(filePath: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.files)
    .createSignedUrl(filePath, DOWNLOAD_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    throw new Error("Unable to create a secure download link.");
  }

  return data.signedUrl;
}

export function publicStorageUrl(bucket: string, path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;
  if (path.startsWith("http")) return path;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
