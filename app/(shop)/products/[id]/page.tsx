import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDict } from "@/lib/i18n";
import { getAllSettings, formatPrice, isProductNew, isSoldOut } from "@/lib/utils";
import { addToCart } from "@/lib/actions/cart-actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const dict = getDict();
  const settings = await getAllSettings();
  const newBadgeDays = parseInt(settings.new_badge_days || "7", 10);

  const product = await prisma.product.findUnique({ where: { id: parseInt(params.id, 10) } });
  if (!product) notFound();

  const soldOut = isSoldOut(product.stockQuantity);
  const isNew = isProductNew(product.createdAt, product.newOverride, newBadgeDays);
  const img = product.image || "https://placehold.co/500x500?text=No+Image";

  async function handleAddToCart(formData: FormData) {
    "use server";
    const qty = Math.max(1, parseInt(String(formData.get("quantity") || "1"), 10));
    await addToCart(product!.id, qty);
    redirect("/cart");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      <div className={`relative w-full h-80 md:h-[420px] rounded-xl shadow overflow-hidden ${soldOut ? "grayscale opacity-70" : ""}`}>
        <Image src={img} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      <div>
        {isNew && !soldOut && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{dict.badge_new}</span>
        )}
        {soldOut && (
          <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">{dict.badge_sold_out}</span>
        )}

        <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-2">{product.name}</h1>
        <p className="text-xl md:text-2xl text-brand font-bold mb-4">{formatPrice(product.price.toString())}</p>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{product.description}</p>

        {soldOut ? (
          <button disabled className="w-full md:w-auto bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
            {dict.badge_sold_out}
          </button>
        ) : (
          <form action={handleAddToCart} className="flex items-center gap-3">
            <input
              type="number"
              name="quantity"
              defaultValue={1}
              min={1}
              max={product.stockQuantity}
              className="w-20 border rounded-lg px-3 py-2"
            />
            <button type="submit" className="flex-1 md:flex-none bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-semibold">
              {dict.add_to_cart}
            </button>
          </form>
        )}
        {!soldOut && (
          <p className="text-sm text-gray-500 mt-2">
            {product.stockQuantity} {dict.in_stock}
          </p>
        )}
      </div>
    </div>
  );
}
