"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCart, saveCart } from "@/lib/cart";
import { getCustomerSession } from "@/lib/auth";
import { sendOrderNotificationEmail } from "@/lib/email";

export async function placeOrder(_prevState: { error: string } | undefined, formData: FormData) {
  const cart = getCart();
  const productIds = Object.keys(cart).map((id) => parseInt(id, 10));

  if (productIds.length === 0) {
    return { error: "Your cart is empty." };
  }

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const address = String(formData.get("address") || "").trim();

  if (!name || !phone || !address) {
    return { error: "Please fill in your name, phone, and delivery address." };
  }

  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  const items = products
    .map((p) => {
      const qty = Math.min(cart[p.id] || 0, p.stockQuantity);
      return { product: p, qty };
    })
    .filter((i) => i.qty > 0);

  if (items.length === 0) {
    return { error: "Your cart items are out of stock." };
  }

  const total = items.reduce((sum, i) => sum + i.qty * Number(i.product.price), 0);
  const session = await getCustomerSession();

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customerId: session?.id,
        guestName: name,
        guestPhone: phone,
        guestEmail: email || null,
        deliveryAddress: address,
        totalAmount: total,
        status: "PENDING",
        paymentMethod: "cod",
      },
    });

    for (const item of items) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.product.id,
          productName: item.product.name,
          priceAtPurchase: item.product.price,
          quantity: item.qty,
        },
      });
      await tx.product.update({
        where: { id: item.product.id },
        data: { stockQuantity: { decrement: item.qty } },
      });
    }

    return newOrder;
  });

  await sendOrderNotificationEmail({
    orderId: order.id,
    guestName: name,
    guestPhone: phone,
    guestEmail: email || null,
    deliveryAddress: address,
    totalAmount: total,
    items: items.map((i) => ({
      productName: i.product.name,
      quantity: i.qty,
      priceAtPurchase: i.product.price.toString(),
    })),
  });

  saveCart({});
  redirect(`/order-success/${order.id}`);
}
