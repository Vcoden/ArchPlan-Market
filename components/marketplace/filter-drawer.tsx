"use client";

import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function FilterDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="size-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <h2 className="font-display text-2xl">Filters</h2>
        <div className="mt-6">
          <FilterSidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
}
