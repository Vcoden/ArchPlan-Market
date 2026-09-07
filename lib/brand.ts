export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "ArchPlan Market",
  tagline:
    process.env.NEXT_PUBLIC_BRAND_TAGLINE ??
    "Find the perfect plan. Build with confidence.",
  shortName: "ArchPlan",
  description:
    "A premium marketplace for professionally designed house plans. Architects upload and sell plans. Homeowners discover, purchase, and download construction-ready design packages.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supportEmail: "support@archplan.market",
  defaultCommissionPercent: Number(
    process.env.DEFAULT_COMMISSION_PERCENT ?? 15,
  ),
  disclaimer:
    "House plans purchased through this marketplace are design products. They may require modification, site-specific adaptation, engineering review, permits, and approval by qualified professionals according to local regulations. Plans are not automatically approved construction documents for every location.",
} as const;

export type BrandConfig = typeof brand;
