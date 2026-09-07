import { FavoritesView } from "@/components/marketplace/favorites-view";
import { readStore } from "@/lib/data/store";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Favorites | ArchPlan Market",
  description: "House plans you have saved for later.",
  path: "/favorites",
});

export default async function FavoritesPage() {
  const store = await readStore();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl">Favorites</h1>
      <div className="mt-8">
        <FavoritesView catalog={store.plans} />
      </div>
    </div>
  );
}
