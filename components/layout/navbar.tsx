"use client";

import { Heart, Menu, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AccountLinks } from "@/components/layout/account-links";
import { SearchBar } from "@/components/marketplace/search-bar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { brand } from "@/lib/brand";

const links = [
  { href: "/plans", label: "House Plans" },
  { href: "/architects", label: "Architects" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/become-an-architect", label: "Become an Architect" },
];

export function Navbar() {
  const { count: favoriteCount } = useFavorites();
  const { count: cartCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <Link href="/" className="font-display text-2xl">
                {brand.name}
              </Link>
              <nav className="mt-8 grid gap-4">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="font-display text-xl tracking-tight sm:text-2xl">
            {brand.name}
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen((open) => !open)} aria-label="Search">
            <Search className="size-4" />
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Favorites">
            <Link href="/favorites" className="relative">
              <Heart className="size-4" />
              {favoriteCount > 0 ? (
                <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-accent text-[10px] text-accent-foreground">
                  {favoriteCount}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Account">
            <Link href="/dashboard">
              <UserRound className="size-4" />
            </Link>
          </Button>
          <AccountLinks />
          <Button asChild>
            <Link href="/become-an-architect">Sell Your Plan</Link>
          </Button>
          {cartCount > 0 ? (
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link href="/cart">Cart ({cartCount})</Link>
            </Button>
          ) : null}
        </div>
      </div>
      {searchOpen ? (
        <div className="border-t bg-background px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <SearchBar size="md" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
