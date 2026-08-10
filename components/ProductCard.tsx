import Image from "next/image";
import Link from "next/link";
import { formatPrice, isProductNew, isSoldOut } from "@/lib/utils";

type ProductCardProps = {
  id: number;
  name: string;
  price: number | string;
  image: string | null;
  stockQuantity: number;
  createdAt: Date;
  newOverride: "AUTO" | "YES" | "NO";
  newBadgeDays: number;
  dict: { badge_new: string; badge_sold_out: string };
};

export default function ProductCard(p: ProductCardProps) {
  const soldOut = isSoldOut(p.stockQuantity);
  const isNew = isProductNew(p.createdAt, p.newOverride, p.newBadgeDays);
  const img = p.image || "https://placehold.co/300x300?text=No+Image";

  return (
    <Link
      href={`/products/${p.id}`}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden block relative"
    >
      {isNew && !soldOut && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
          {p.dict.badge_new}
        </span>
      )}
      {soldOut && (
        <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full z-10">
          {p.dict.badge_sold_out}
        </span>
      )}
      <div className={`relative w-full h-32 sm:h-40 md:h-44 ${soldOut ? "grayscale opacity-60" : ""}`}>
        <Image src={img} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
      <div className="p-2 md:p-3">
        <h3 className="font-semibold text-sm truncate">{p.name}</h3>
        <p className="text-brand font-bold text-sm md:text-base">{formatPrice(p.price)}</p>
      </div>
    </Link>
  );
}
