import { FavoritesView } from "@/components/marketplace/favorites-view";
import { readStore } from "@/lib/data/store";

export default async function DashboardFavoritesPage() {
  const store = await readStore();
  return (
    <div>
      <h1 className="font-display text-4xl">Favorites</h1>
      <div className="mt-8">
        <FavoritesView catalog={store.plans} />
      </div>
    </div>
  );
}
