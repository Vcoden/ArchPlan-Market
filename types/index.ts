export type UserRole = "homeowner" | "architect" | "admin";

export type ArchitectApprovalStatus = "pending" | "approved" | "rejected";

export type PlanStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected"
  | "suspended";

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "refunded"
  | "cancelled";

export type PayoutStatus = "pending" | "processing" | "completed" | "rejected";

export type MediaType =
  | "main"
  | "gallery"
  | "floor_plan"
  | "exterior"
  | "interior"
  | "watermarked";

export type PlanFileType =
  | "pdf"
  | "dwg"
  | "dxf"
  | "jpg"
  | "png"
  | "skp"
  | "rvt"
  | "zip"
  | "other";

export type ArchitecturalStyle =
  | "modern"
  | "contemporary"
  | "traditional"
  | "farmhouse"
  | "mediterranean"
  | "minimalist"
  | "craftsman"
  | "colonial"
  | "ranch"
  | "luxury"
  | "duplex"
  | "apartment";

export type PropertyType =
  | "single_family"
  | "duplex"
  | "townhouse"
  | "multi_family"
  | "vacation_home"
  | "villa";

export type SortOption = "popularity" | "newest" | "best_rated" | "price_asc" | "price_desc";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: UserRole;
  country: string | null;
  bio: string | null;
  phone: string | null;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArchitectProfile {
  id: string;
  user_id: string;
  professional_name: string;
  slug: string;
  title: string | null;
  biography: string | null;
  location: string | null;
  country: string | null;
  years_experience: number | null;
  website: string | null;
  portfolio_url: string | null;
  instagram: string | null;
  linkedin: string | null;
  behance: string | null;
  approval_status: ArchitectApprovalStatus;
  rejection_reason: string | null;
  specializations: string[];
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
  rating?: number;
  plan_count?: number;
  sales_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface PlanRoom {
  id: string;
  plan_id: string;
  name: string;
  width: number | null;
  depth: number | null;
  area: number | null;
  notes: string | null;
}

export interface PlanMedia {
  id: string;
  plan_id: string;
  file_path: string;
  media_type: MediaType;
  is_primary: boolean;
  alt: string | null;
  created_at: string;
}

export interface PlanFile {
  id: string;
  plan_id: string;
  file_path: string;
  file_type: PlanFileType;
  file_name: string;
  file_size: number | null;
  created_at: string;
}

export interface Plan {
  id: string;
  architect_id: string;
  title: string;
  slug: string;
  description: string;
  overview: string | null;
  category_id: string | null;
  property_type: PropertyType;
  architectural_style: ArchitecturalStyle;
  price: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  floor_area: number;
  lot_width: number | null;
  lot_depth: number | null;
  garage_spaces: number;
  has_living_room: boolean;
  has_dining_room: boolean;
  has_kitchen: boolean;
  has_office: boolean;
  has_laundry: boolean;
  has_balcony: boolean;
  has_basement: boolean;
  has_pool: boolean;
  features: string[];
  included_items: string[];
  file_formats: PlanFileType[];
  delivery_information: string | null;
  important_notes: string | null;
  status: PlanStatus;
  featured: boolean;
  review_notes: string | null;
  average_rating: number;
  review_count: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
  architect?: ArchitectProfile;
  category?: Category | null;
  media?: PlanMedia[];
  files?: PlanFile[];
  rooms?: PlanRoom[];
  main_image?: string;
}

export interface Review {
  id: string;
  buyer_id: string;
  plan_id: string;
  rating: number;
  title: string;
  content: string;
  verified_purchase: boolean;
  architect_response: string | null;
  architect_responded_at: string | null;
  created_at: string;
  buyer_name?: string;
  buyer_avatar?: string | null;
  plan_title?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  plan_id: string;
  created_at: string;
  plan?: Plan;
}

export interface CartItem {
  planId: string;
  addedAt: string;
  plan?: Plan;
}

export interface OrderItem {
  id: string;
  order_id: string;
  plan_id: string;
  architect_id: string;
  price: number;
  commission_percentage: number;
  platform_commission: number;
  architect_earnings: number;
  plan_title?: string;
  architect_name?: string;
  plan?: Plan;
}

export interface Order {
  id: string;
  buyer_id: string;
  subtotal: number;
  commission_percentage: number;
  platform_commission: number;
  architect_earnings: number;
  payment_fee: number;
  total: number;
  currency: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
}

export interface Transaction {
  id: string;
  order_id: string;
  payment_provider: string;
  provider_transaction_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
}

export interface Payout {
  id: string;
  architect_id: string;
  amount: number;
  status: PayoutStatus;
  payout_method: string;
  notes: string | null;
  requested_at: string;
  processed_at: string | null;
}

export interface DownloadRecord {
  id: string;
  buyer_id: string;
  plan_id: string;
  order_id: string;
  file_id: string;
  downloaded_at: string;
  file_name?: string;
  plan_title?: string;
}

export interface PlanFilters {
  query?: string;
  style?: ArchitecturalStyle | ArchitecturalStyle[];
  propertyType?: PropertyType | PropertyType[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  minArea?: number;
  maxArea?: number;
  minLotWidth?: number;
  minLotDepth?: number;
  garage?: boolean;
  sort?: SortOption;
  featured?: boolean;
  architect?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalSales: number;
  totalEarnings: number;
  availableBalance: number;
  publishedPlans: number;
  pendingOrders: number;
}

export interface AdminStats {
  totalUsers: number;
  totalArchitects: number;
  publishedPlans: number;
  totalOrders: number;
  grossSales: number;
  platformRevenue: number;
  pendingPayouts: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}
