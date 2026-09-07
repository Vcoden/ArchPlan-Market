import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoverImage } from "@/components/marketplace/cover-image";
import { PlanGrid } from "@/components/marketplace/plan-grid";
import { SearchBar } from "@/components/marketplace/search-bar";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { listArchitects } from "@/services/architects";
import { listCategories } from "@/services/categories";
import { getFeaturedPlans } from "@/services/plans";
import { ArchitectCard } from "@/components/marketplace/architect-card";

export default async function HomePage() {
  const [featured, categories, architects] = await Promise.all([
    getFeaturedPlans(6),
    listCategories(),
    listArchitects(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="Modern architectural residence"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,25,22,0.55)_0%,rgba(28,25,22,0.72)_100%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:py-36">
          <p className="text-sm tracking-[0.22em] text-white/70 uppercase">{brand.name}</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl text-white sm:text-6xl lg:text-7xl">
            Find a House Plan You&apos;ll Love to Build.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Explore professionally designed house plans from architects around the world. Compare
            layouts, styles, sizes, and prices before choosing the right plan for your project.
          </p>
          <div className="mt-10 max-w-2xl">
            <SearchBar />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href="/plans">Explore House Plans</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
              <Link href="/become-an-architect">Sell Your Plan</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Marketplace</p>
            <h2 className="mt-2 font-display text-4xl">Featured House Plans</h2>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/plans">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10">
          <PlanGrid plans={featured} />
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-4xl">Browse by style</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category.id}
                href={`/plans?category=${category.slug}`}
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="image-frame relative aspect-[4/5]">
                  <CoverImage src={category.image_url} alt={category.name} sizes="20vw" />
                  <div className="absolute inset-0 bg-foreground/35" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-display text-2xl">{category.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            {
              title: "Discover",
              text: "Search by style, bedrooms, lot size, or architect. Every listing shows the information you need before you buy.",
            },
            {
              title: "Purchase",
              text: "Checkout is built for digital products. After payment, the plan is added to your library immediately.",
            },
            {
              title: "Build",
              text: "Download CAD and PDF files, then work with a local architect or engineer to adapt the design to your site.",
            },
          ].map((item, index) => (
            <div key={item.title} className="border-t pt-6">
              <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-3xl">{item.title}</h3>
              <p className="mt-3 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-4xl">Featured architects</h2>
            <Button asChild variant="outline">
              <Link href="/architects">All architects</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {architects.slice(0, 3).map((architect) => (
              <ArchitectCard key={architect.id} architect={architect} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl bg-primary px-8 py-14 text-primary-foreground sm:px-14">
          <p className="text-xs tracking-[0.2em] uppercase opacity-70">For architects</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">
            Turn your architectural designs into income.
          </h2>
          <p className="mt-4 max-w-xl text-primary-foreground/75">
            Publish house plans, reach homeowners looking to build, and earn from every sale. The
            platform handles checkout, delivery, and commission accounting.
          </p>
          <Button asChild size="lg" className="mt-8 bg-white text-foreground hover:bg-white/90">
            <Link href="/become-an-architect">Start Selling</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
