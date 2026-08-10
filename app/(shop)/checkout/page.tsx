import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDict } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { getCart } from "@/lib/cart";
import { getCustomerSession } from "@/lib/auth";
import { placeOrder } from "@/lib/actions/checkout-actions";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const dict = getDict();
  const cart = getCart();
  const ids = Object.keys(cart).map((id) => parseInt(id, 10));

  if (ids.length === 0) redirect("/cart");

  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const items = products
    .map((p) => {
      const qty = Math.min(cart[p.id] || 0, p.stockQuantity);
      return { product: p, qty, subtotal: qty * Number(p.price) };
    })
    .filter((i) => i.qty > 0);
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);

  const session = await getCustomerSession();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{dict.checkout_title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="bg-white rounded-xl shadow p-6 order-2 md:order-1">
          <h2 className="font-bold text-lg mb-4">{dict.order_summary}</h2>
          {items.map(({ product: p, qty, subtotal }) => (
            <div key={p.id} className="flex justify-between text-sm py-2 border-b">
              <span>
                {p.name} x{qty}
              </span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>{dict.total}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">💵 {dict.payment_cod}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 order-1 md:order-2">
          <h2 className="font-bold text-lg mb-4">{dict.delivery_info}</h2>
          {!session && (
            <p className="text-sm text-gray-500 mb-4">
              <Link href="/login" className="text-brand underline">
                {dict.nav_login}
              </Link>{" "}
              — {dict.login_faster}
            </p>
          )}
          <form action={placeOrder} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder={dict.full_name}
              required
              defaultValue={session?.name || ""}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input type="text" name="phone" placeholder={dict.phone_number} required className="w-full border rounded-lg px-3 py-2" />
            <input type="email" name="email" placeholder={dict.email_optional} className="w-full border rounded-lg px-3 py-2" />
            <textarea name="address" placeholder={dict.delivery_address} required rows={3} className="w-full border rounded-lg px-3 py-2" />
            <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-lg font-semibold">
              {dict.place_order}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
