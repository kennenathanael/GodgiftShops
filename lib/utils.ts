import { prisma } from "./prisma";

export function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(amount: number | string, currency = "XAF"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${Math.round(num).toLocaleString("fr-FR")} ${currency}`;
}

export function isSoldOut(stockQuantity: number): boolean {
  return stockQuantity <= 0;
}

export function isProductNew(
  createdAt: Date,
  newOverride: "AUTO" | "YES" | "NO",
  newBadgeDays = 7
): boolean {
  if (newOverride === "YES") return true;
  if (newOverride === "NO") return false;
  const diffDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= newBadgeDays;
}

// Simple in-memory cache for settings during a single request lifecycle isn't
// persisted across requests in serverless, so we just query each time —
// the settings table is tiny so this is cheap.
export async function getSetting(key: string, fallback = ""): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
