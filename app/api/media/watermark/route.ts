import { NextResponse } from "next/server";
import { watermarkPreview } from "@/lib/storage/watermark";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { STORAGE_BUCKETS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image to watermark." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const watermarked = await watermarkPreview(buffer);

    if (!isSupabaseConfigured()) {
      return new NextResponse(Uint8Array.from(watermarked), {
        headers: { "Content-Type": "image/webp" },
      });
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in to upload previews." }, { status: 401 });

    const path = `${user.id}/${crypto.randomUUID()}.webp`;
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.previews).upload(path, watermarked, {
      contentType: "image/webp",
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: "Unable to store the watermarked preview." }, { status: 400 });
    }

    return NextResponse.json({ path });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
