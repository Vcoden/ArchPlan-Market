import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { updateStore } from "@/lib/data/store";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const profile = await getSessionAccount();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { name, description, imageUrl } = (await request.json()) as {
    name?: string;
    description?: string;
    imageUrl?: string;
  };
  if (!name?.trim()) return NextResponse.json({ error: "Enter a category name." }, { status: 400 });

  await updateStore((store) => {
    store.categories.push({
      id: crypto.randomUUID(),
      name: name.trim(),
      slug: slugify(name),
      description: description ?? "",
      image_url: imageUrl ?? null,
      sort_order: store.categories.length + 1,
    });
  });
  return NextResponse.json({ ok: true });
}
