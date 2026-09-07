import { NextResponse } from "next/server";
import { getSessionAccount } from "@/lib/auth/account";
import { getArchitectForUser, publishedPlans, readStore, updateStore } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { slugify } from "@/lib/utils";
import { planFormSchema } from "@/lib/validations/plan";
import type { ArchitecturalStyle, Plan, PlanFileType, PropertyType } from "@/types";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({ plans: publishedPlans(store) });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const parsed = planFormSchema.safeParse({
      title: form.get("title"),
      description: form.get("description"),
      categoryId: form.get("categoryId"),
      architecturalStyle: form.get("architecturalStyle"),
      propertyType: form.get("propertyType"),
      price: form.get("price"),
      bedrooms: form.get("bedrooms"),
      bathrooms: form.get("bathrooms"),
      floors: form.get("floors"),
      floorArea: form.get("floorArea"),
      lotWidth: form.get("lotWidth") || undefined,
      lotDepth: form.get("lotDepth") || undefined,
      garageSpaces: form.get("garageSpaces") || 0,
      includedItems: String(form.get("includedItems") ?? ""),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete the required plan fields." }, { status: 400 });
    }

    const profile = await getSessionAccount();
    if (!profile) return NextResponse.json({ error: "Sign in as an architect to publish." }, { status: 401 });

    const intent = String(form.get("intent") ?? "submit");
    const values = parsed.data;
    const amenities = form.getAll("amenities").map(String);
    const fileFormats = form.getAll("fileFormats").map(String) as PlanFileType[];

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data: architect } = await supabase
        .from("architect_profiles")
        .select("id, approval_status")
        .eq("user_id", profile.id)
        .maybeSingle();
      if (!architect || architect.approval_status !== "approved") {
        return NextResponse.json({ error: "Only approved architects can publish plans." }, { status: 403 });
      }
      const { error } = await supabase.from("plans").insert({
        architect_id: architect.id,
        title: values.title,
        slug: slugify(values.title),
        description: values.description,
        category_id: values.categoryId,
        architectural_style: values.architecturalStyle,
        property_type: values.propertyType,
        price: values.price,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        floors: values.floors,
        floor_area: values.floorArea,
        lot_width: values.lotWidth,
        lot_depth: values.lotDepth,
        garage_spaces: values.garageSpaces,
        included_items: values.includedItems?.split("\n").filter(Boolean) ?? [],
        status: intent === "draft" ? "draft" : "pending_review",
      });
      if (error) return NextResponse.json({ error: "Unable to save this listing." }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    const store = await readStore();
    const architect = getArchitectForUser(store, profile.id);
    if (!architect || architect.approval_status !== "approved") {
      return NextResponse.json({ error: "Only approved architects can publish plans." }, { status: 403 });
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const plan: Plan = {
      id,
      architect_id: architect.id,
      title: values.title,
      slug: slugify(values.title),
      description: values.description,
      overview: values.description,
      category_id: values.categoryId ?? null,
      property_type: values.propertyType as PropertyType,
      architectural_style: values.architecturalStyle as ArchitecturalStyle,
      price: values.price,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      floors: values.floors,
      floor_area: values.floorArea,
      lot_width: values.lotWidth ?? null,
      lot_depth: values.lotDepth ?? null,
      garage_spaces: values.garageSpaces,
      has_living_room: amenities.includes("Living room"),
      has_dining_room: amenities.includes("Dining room"),
      has_kitchen: amenities.includes("Kitchen"),
      has_office: amenities.includes("Office"),
      has_laundry: amenities.includes("Laundry"),
      has_balcony: amenities.includes("Balcony"),
      has_basement: amenities.includes("Basement"),
      has_pool: amenities.includes("Pool"),
      features: amenities,
      included_items: values.includedItems?.split("\n").filter(Boolean) ?? [],
      file_formats: fileFormats,
      delivery_information: "Digital files are available immediately after payment.",
      important_notes: "Local engineering and permits remain the buyer’s responsibility.",
      status: intent === "draft" ? "draft" : "pending_review",
      featured: false,
      review_notes: null,
      average_rating: 0,
      review_count: 0,
      sales_count: 0,
      created_at: now,
      updated_at: now,
      architect,
      category: store.categories.find((category) => category.id === values.categoryId) ?? null,
      media: [],
      files: [
        {
          id: `${id}-file-pdf`,
          plan_id: id,
          file_path: `virtual/${id}/floor-plans.pdf`,
          file_type: "pdf",
          file_name: `${slugify(values.title)}-floor-plans.pdf`,
          file_size: 1,
          created_at: now,
        },
      ],
      rooms: [],
    };

    await updateStore((next) => {
      next.plans.push(plan);
      architect.plan_count = (architect.plan_count ?? 0) + 1;
    });

    return NextResponse.json({ ok: true, id, status: plan.status });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
