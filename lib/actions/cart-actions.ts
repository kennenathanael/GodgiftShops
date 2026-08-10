"use server";

import { revalidatePath } from "next/cache";
import { getCart, saveCart } from "@/lib/cart";

export async function addToCart(productId: number, quantity: number) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + quantity;
  saveCart(cart);
  revalidatePath("/cart");
}

export async function updateCartQuantities(formData: FormData) {
  const cart = getCart();
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("qty_")) continue;
    const productId = key.replace("qty_", "");
    const qty = parseInt(String(value), 10);
    if (!qty || qty <= 0) {
      delete cart[productId];
    } else {
      cart[productId] = qty;
    }
  }
  saveCart(cart);
  revalidatePath("/cart");
}

export async function removeFromCart(productId: number) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  revalidatePath("/cart");
}
