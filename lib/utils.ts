import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { brand } from "@/lib/brand";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatNumber(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatArea(sqft: number) {
  return `${formatNumber(sqft)} sq ft`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function calculateCommission(
  price: number,
  commissionPercent: number,
  paymentFee = 0,
) {
  const platformCommission = roundMoney((price * commissionPercent) / 100);
  const architectEarnings = roundMoney(price - platformCommission - paymentFee);
  return { platformCommission, architectEarnings };
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function absoluteUrl(path = "") {
  return `${brand.url}${path.startsWith("/") ? path : `/${path}`}`;
}
