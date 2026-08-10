import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings, formatPrice, isProductNew, isSoldOut } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";
import { deleteProduct } from "@/lib/actions/product-actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getAllSettings();
  const newBadgeDays = parseInt(settings.new_badge_days || "7", 10);

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle="Products">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">All Products ({products.length})</h2>
        <Link href="/admin/products/new" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const img = p.image || "https://placehold.co/60x60?text=No+Img";
              const soldOut = isSoldOut(p.stockQuantity);
              const isNew = isProductNew(p.createdAt, p.newOverride, newBadgeDays);
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <div className="relative w-12 h-12">
                      <Image src={img} alt={p.name} fill className="object-cover rounded-lg" sizes="48px" />
                    </div>
                  </td>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.category.name}</td>
                  <td>{formatPrice(p.price.toString())}</td>
                  <td>{p.stockQuantity}</td>
                  <td>
                    {soldOut ? (
                      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">Sold Out</span>
                    ) : isNew ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Active</span>
                    )}
                  </td>
                  <td>{p.createdAt.toLocaleDateString()}</td>
                  <td className="space-x-2 whitespace-nowrap">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <DeleteButton productId={p.id} />
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No products yet. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function DeleteButton({ productId }: { productId: number }) {
  async function handleDelete() {
    "use server";
    await deleteProduct(productId);
  }
  return (
    <form action={handleDelete} className="inline">
      <button type="submit" className="text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
