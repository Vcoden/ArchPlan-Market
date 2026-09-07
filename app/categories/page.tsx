import Link from "next/link";
import { CoverImage } from "@/components/marketplace/cover-image";
import { createMetadata } from "@/lib/seo";
import { listCategories } from "@/services/categories";

export const metadata = createMetadata({
  title: "Categories | ArchPlan Market",
  description: "Browse house plans by architectural style and home type.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl">Categories</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Start with a style or household type, then refine by size and lot.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/plans?category=${category.slug}`}
            className="group overflow-hidden rounded-xl border bg-card"
          >
            <div className="image-frame relative aspect-[16/10]">
              <CoverImage src={category.image_url} alt={category.name} sizes="(max-width: 1024px) 100vw, 33vw" />
            </div>
            <div className="p-5">
              <h2 className="font-display text-2xl">{category.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
