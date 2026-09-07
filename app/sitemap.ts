import type { MetadataRoute } from "next";
import { seedArchitects, seedCategories, seedPlans } from "@/lib/data/seed";
import { brand } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/plans",
    "/architects",
    "/categories",
    "/how-it-works",
    "/become-an-architect",
    "/about",
    "/contact",
    "/faq",
    "/terms",
    "/privacy",
    "/help",
    "/pricing",
    "/seller-guide",
  ].map((path) => ({
    url: `${brand.url}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...seedPlans.map((plan) => ({ url: `${brand.url}/plans/${plan.slug}`, lastModified: new Date(plan.updated_at) })),
    ...seedArchitects.map((architect) => ({
      url: `${brand.url}/architects/${architect.slug}`,
      lastModified: new Date(architect.updated_at),
    })),
    ...seedCategories.map((category) => ({
      url: `${brand.url}/plans?category=${category.slug}`,
      lastModified: new Date(),
    })),
  ];
}
