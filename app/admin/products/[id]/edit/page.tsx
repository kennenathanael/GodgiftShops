import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";
import ProductForm from "../../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getAllSettings();
  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findUnique({ where: { id: parseInt(params.id, 10) } }),
  ]);

  if (!product) notFound();

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle="Edit Product">
      <ProductForm
        categories={categories}
        mode="edit"
        product={{
          id: product.id,
          name: product.name,
          categoryId: product.categoryId,
          price: product.price.toString(),
          stockQuantity: product.stockQuantity,
          description: product.description,
          image: product.image,
          isFeatured: product.isFeatured,
          newOverride: product.newOverride,
        }}
      />
    </AdminShell>
  );
}
