import { cookies } from "next/headers";

export type Cart = Record<string, number>; // productId -> quantity

export function getCart(): Cart {
  const raw = cookies().get("cart")?.value;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveCart(cart: Cart) {
  cookies().set("cart", JSON.stringify(cart), { path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}
