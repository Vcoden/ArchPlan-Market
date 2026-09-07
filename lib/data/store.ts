import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { brand } from "@/lib/brand";
import { seedArchitects, seedCategories, seedPlans, seedReviews } from "@/lib/data/seed";
import type {
  ArchitectProfile,
  Category,
  DownloadRecord,
  Order,
  OrderItem,
  Plan,
  PlanFile,
  Profile,
  Review,
  Payout,
  UserRole,
} from "@/types";

export type LocalAccount = Profile & {
  email: string;
  password_hash: string;
};

export type StoredOrder = Order & {
  buyer_email: string;
  items: (OrderItem & { plan_title: string; architect_name: string })[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type MarketplaceStore = {
  initialized: boolean;
  settings: { platform_commission: number };
  accounts: LocalAccount[];
  architects: ArchitectProfile[];
  plans: Plan[];
  reviews: Review[];
  orders: StoredOrder[];
  payouts: Payout[];
  downloads: DownloadRecord[];
  categories: Category[];
  messages: ContactMessage[];
};

const STORE_PATH = path.join(process.cwd(), ".data", "marketplace.json");

let writeQueue: Promise<unknown> = Promise.resolve();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function withDefaultFiles(plan: Plan): Plan {
  if (plan.files?.length) return plan;
  const created = new Date().toISOString();
  const files: PlanFile[] = [
    {
      id: `${plan.id}-file-pdf`,
      plan_id: plan.id,
      file_path: `virtual/${plan.id}/floor-plans.pdf`,
      file_type: "pdf",
      file_name: `${plan.slug}-floor-plans.pdf`,
      file_size: 240000,
      created_at: created,
    },
    {
      id: `${plan.id}-file-dwg`,
      plan_id: plan.id,
      file_path: `virtual/${plan.id}/cad.dwg`,
      file_type: "dwg",
      file_name: `${plan.slug}-cad.dwg`,
      file_size: 1200000,
      created_at: created,
    },
  ];
  return { ...plan, files, file_formats: plan.file_formats.length ? plan.file_formats : ["pdf", "dwg"] };
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 32);
  return timingSafeEqual(Buffer.from(hash, "hex"), next);
}

function createAdminAccount(): LocalAccount {
  const now = new Date().toISOString();
  return {
    id: "user-admin",
    email: "admin@archplan.market",
    password_hash: hashPassword("Admin1234!"),
    full_name: "Marketplace Admin",
    avatar_url: null,
    role: "admin",
    country: "United States",
    bio: "Platform administrator",
    phone: null,
    is_suspended: false,
    created_at: now,
    updated_at: now,
  };
}

function emptyStore(): MarketplaceStore {
  return {
    initialized: true,
    settings: { platform_commission: brand.defaultCommissionPercent },
    accounts: [createAdminAccount()],
    architects: clone(seedArchitects),
    plans: seedPlans.map((plan) => withDefaultFiles(clone(plan))),
    reviews: clone(seedReviews),
    orders: [],
    payouts: [],
    downloads: [],
    categories: clone(seedCategories),
    messages: [],
  };
}

const DEAD_UNSPLASH_IDS = [
  "photo-1600047509807-ba8f99d2cdbc",
  "photo-1600607687644-c7171b42498b",
];

function hasDeadCatalogImage(url?: string | null) {
  return Boolean(url && DEAD_UNSPLASH_IDS.some((id) => url.includes(id)));
}

function repairCatalogMedia(store: MarketplaceStore): { store: MarketplaceStore; changed: boolean } {
  const seedPlanById = new Map(seedPlans.map((plan) => [plan.id, plan]));
  const seedCategoryById = new Map(seedCategories.map((category) => [category.id, category]));
  let changed = false;

  const plans = store.plans.map((plan) => {
    const seed = seedPlanById.get(plan.id);
    if (!seed) return plan;
    const mediaBroken = plan.media?.some((item) => hasDeadCatalogImage(item.file_path));
    if (!hasDeadCatalogImage(plan.main_image) && !mediaBroken) return plan;
    changed = true;
    return {
      ...plan,
      main_image: seed.main_image,
      media: clone(seed.media),
    };
  });

  const categories = store.categories.map((category) => {
    const seed = seedCategoryById.get(category.id);
    if (!seed || !hasDeadCatalogImage(category.image_url)) return category;
    changed = true;
    return { ...category, image_url: seed.image_url };
  });

  return { store: { ...store, plans, categories }, changed };
}

async function readStoreFile(): Promise<MarketplaceStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as MarketplaceStore;
    if (!parsed.initialized) {
      const fresh = emptyStore();
      await writeStoreFile(fresh);
      return fresh;
    }
    const merged = {
      ...emptyStore(),
      ...parsed,
      settings: { ...emptyStore().settings, ...parsed.settings },
    };
    const repaired = repairCatalogMedia(merged);
    if (repaired.changed) {
      await writeStoreFile(repaired.store);
    }
    return repaired.store;
  } catch {
    const fresh = emptyStore();
    await writeStoreFile(fresh);
    return fresh;
  }
}

async function writeStoreFile(store: MarketplaceStore) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function readStore() {
  return readStoreFile();
}

export async function updateStore<T>(mutator: (store: MarketplaceStore) => T): Promise<T> {
  const run = writeQueue.then(async () => {
    const store = await readStoreFile();
    const result = mutator(store);
    await writeStoreFile(store);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

export function toProfile(account: LocalAccount): Profile {
  const { password_hash: _password, ...profile } = account;
  return profile;
}

export function findAccount(store: MarketplaceStore, id: string) {
  return store.accounts.find((account) => account.id === id) ?? null;
}

export function findAccountByEmail(store: MarketplaceStore, email: string) {
  return store.accounts.find((account) => account.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getArchitectForUser(store: MarketplaceStore, userId: string) {
  return store.architects.find((architect) => architect.user_id === userId) ?? null;
}

export function getCommissionPercent(store: MarketplaceStore) {
  return store.settings.platform_commission ?? brand.defaultCommissionPercent;
}

export function publishedPlans(store: MarketplaceStore) {
  return store.plans.filter((plan) => plan.status === "published");
}

export function findPlan(store: MarketplaceStore, idOrSlug: string) {
  return store.plans.find((plan) => plan.id === idOrSlug || plan.slug === idOrSlug) ?? null;
}

export function buyerOrders(store: MarketplaceStore, buyerId: string) {
  return store.orders.filter((order) => order.buyer_id === buyerId);
}

export function architectOrders(store: MarketplaceStore, architectId: string) {
  return store.orders.filter((order) => order.items.some((item) => item.architect_id === architectId));
}

export function architectEarnings(store: MarketplaceStore, architectId: string) {
  const paid = architectOrders(store, architectId).filter((order) => order.payment_status === "succeeded");
  const lifetime = paid.reduce(
    (sum, order) =>
      sum +
      order.items
        .filter((item) => item.architect_id === architectId)
        .reduce((inner, item) => inner + item.architect_earnings, 0),
    0,
  );
  const reserved = store.payouts
    .filter((payout) => payout.architect_id === architectId && payout.status !== "rejected")
    .reduce((sum, payout) => sum + payout.amount, 0);
  return {
    lifetime,
    available: Math.max(0, Math.round((lifetime - reserved) * 100) / 100),
    sales: paid.reduce(
      (sum, order) => sum + order.items.filter((item) => item.architect_id === architectId).length,
      0,
    ),
  };
}

export function createAccount(input: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}): LocalAccount {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    email: input.email,
    password_hash: hashPassword(input.password),
    full_name: input.fullName,
    avatar_url: null,
    role: input.role,
    country: null,
    bio: null,
    phone: null,
    is_suspended: false,
    created_at: now,
    updated_at: now,
  };
}
