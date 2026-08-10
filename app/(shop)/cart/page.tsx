import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDict } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { getCart } from "@/lib/cart";
import { updateCartQuantities, removeFromCart } from "@/lib/actions/cart-actions";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const dict = getDict();
  const cart = getCart();
  const ids = Object.keys(cart).map((id) => parseInt(id, 10));

  const products = ids.length > 0 ? await prisma.product.findMany({ where: { id: { in: ids } } }) : [];

  const items = products.map((p) => {
    const qty = cart[p.id];
    return { product: p, qty, subtotal: qty * Number(p.price) };
  });
  const total = items.reduce((sum, i) => sum + i.subtotal, 0);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{dict.your_cart}</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">
          {dict.cart_empty}{" "}
          <Link href="/products" className="text-brand underline">
            {dict.browse_products}
          </Link>
        </p>
      ) : (
        <>
          <form action={updateCartQuantities}>
            <div className="bg-white rounded-xl shadow divide-y">
              {items.map(({ product: p, qty }) => {
                const img = p.image || "https://placehold.co/100x100?text=No+Image";
                return (
                  <div key={p.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 md:gap-4 p-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image src={img} alt={p.name} fill className="object-cover rounded-lg" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-brand font-bold">{formatPrice(p.price.toString())}</p>
                    </div>
                    <input
                      type="number"
                      name={`qty_${p.id}`}
                      defaultValue={qty}
                      min={0}
                      max={p.stockQuantity}
                      className="w-16 border rounded-lg px-2 py-1 text-center"
                    />
                    <RemoveButton productId={p.id} label={dict.remove} />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-6">
              <button type="submit" className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg font-medium">
                {dict.update_cart}
              </button>
              <div className="text-xl font-bold">
                {dict.total}: {formatPrice(total)}
              </div>
            </div>
          </form>

          <div className="mt-6 text-right">
            <Link
              href="/checkout"
              className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-semibold inline-block text-center"
            >
              {dict.proceed_checkout} →
            </Link>
          </div>
        </>
      )}
    </>
  );
}

function RemoveButton({ productId, label }: { productId: number; label: string }) {
  async function handleRemove() {
    "use server";
    await removeFromCart(productId);
  }
  return (
    <form action={handleRemove}>
      <button type="submit" className="text-red-500 text-sm hover:underline">
        {label}
      </button>
    </form>
  );
}
