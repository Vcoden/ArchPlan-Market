import Link from "next/link";
import { brand } from "@/lib/brand";

const groups = [
  {
    title: "Marketplace",
    links: [
      { href: "/plans", label: "Browse Plans" },
      { href: "/plans?featured=1", label: "Featured Plans" },
      { href: "/categories", label: "Categories" },
      { href: "/architects", label: "Architects" },
    ],
  },
  {
    title: "Sell",
    links: [
      { href: "/become-an-architect", label: "Become an Architect" },
      { href: "/seller-guide", label: "Seller Guide" },
      { href: "/pricing", label: "Pricing" },
      { href: "/dashboard/architect", label: "Seller Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/contact", label: "Contact Support" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-1">
          <p className="font-display text-2xl">{brand.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{brand.tagline}</p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {group.title}
            </p>
            <ul className="mt-4 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs leading-relaxed text-muted-foreground sm:px-6">
          {brand.disclaimer}
        </div>
      </div>
    </footer>
  );
}
