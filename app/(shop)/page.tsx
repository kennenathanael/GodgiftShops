import { prisma } from "@/lib/prisma";
import { getDict } from "@/lib/i18n";
import { getAllSettings } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const dict = getDict();
  const settings = await getAllSettings();
  const newBadgeDays = parseInt(settings.new_badge_days || "7", 10);

  const categorySlug = searchParams.category;
  const search = (searchParams.q || "").trim();

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { categoryId: category.id } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const qs = (extra: string) => (search ? `${extra}&q=${encodeURIComponent(search)}` : extra);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{dict.nav_products}</h1>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b">
        <a
          href={`/products?${qs("")}`}
          className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-medium ${
            !category ? "bg-brand text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          {dict.nav_all}
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/products?${qs(`category=${cat.slug}`)}`}
            className={`px-4 py-2 whitespace-nowrap rounded-t-lg font-medium ${
              category?.id === cat.id ? "bg-brand text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Search */}
      <form method="get" className="mb-6">
        {category && <input type="hidden" name="category" value={category.slug} />}
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder={dict.search_placeholder}
          className="w-full md:w-1/2 border rounded-lg px-3 py-2 text-sm"
        />
      </form>

      {products.length === 0 ? (
        <p className="text-gray-500">{dict.no_products}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price.toString()}
              image={p.image}
              stockQuantity={p.stockQuantity}
              createdAt={p.createdAt}
              newOverride={p.newOverride}
              newBadgeDays={newBadgeDays}
              dict={dict}
            />
          ))}
        </div>
      )}
    </>
  );
}
