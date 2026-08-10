import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";
import { deleteCategory } from "@/lib/actions/category-actions";
import CategoryAddForm from "./CategoryAddForm";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getAllSettings();
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle="Categories">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="p-3">Name</th>
                <th>Slug</th>
                <th># Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td>{cat.slug}</td>
                  <td>{cat._count.products}</td>
                  <td className="space-x-2">
                    <Link href={`/admin/categories/${cat.id}/edit`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <DeleteButton categoryId={cat.id} />
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Add Category</h2>
          <CategoryAddForm />
        </div>
      </div>
    </AdminShell>
  );
}

function DeleteButton({ categoryId }: { categoryId: number }) {
  async function handleDelete() {
    "use server";
    await deleteCategory(categoryId);
  }
  return (
    <form action={handleDelete} className="inline">
      <button type="submit" className="text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
