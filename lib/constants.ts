import type {
  ArchitecturalStyle,
  PlanFileType,
  PropertyType,
  SortOption,
} from "@/types";

export const ARCHITECTURAL_STYLES: {
  value: ArchitecturalStyle;
  label: string;
}[] = [
  { value: "modern", label: "Modern" },
  { value: "contemporary", label: "Contemporary" },
  { value: "traditional", label: "Traditional" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "minimalist", label: "Minimalist" },
  { value: "craftsman", label: "Craftsman" },
  { value: "colonial", label: "Colonial" },
  { value: "ranch", label: "Ranch" },
  { value: "luxury", label: "Luxury" },
  { value: "duplex", label: "Duplex" },
  { value: "apartment", label: "Apartment" },
];

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "single_family", label: "Single Family" },
  { value: "duplex", label: "Duplex" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi_family", label: "Multi-Family" },
  { value: "vacation_home", label: "Vacation Home" },
  { value: "villa", label: "Villa" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "best_rated", label: "Best rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export const PLAN_FILE_TYPES: { value: PlanFileType; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "dwg", label: "DWG" },
  { value: "dxf", label: "DXF" },
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "skp", label: "SketchUp" },
  { value: "rvt", label: "Revit" },
  { value: "zip", label: "ZIP" },
  { value: "other", label: "Other" },
];

export const DEFAULT_INCLUDED_ITEMS = [
  "Dimensioned floor plans",
  "Exterior elevations",
  "Roof plan",
  "Electrical layout",
  "Foundation plan",
  "PDF files",
  "CAD files",
];

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  previews: "plan-previews",
  files: "plan-files",
  categories: "category-images",
  portfolios: "portfolios",
} as const;

export const PAGE_SIZE = 12;
export const DEFAULT_COMMISSION_PERCENT = 15;
