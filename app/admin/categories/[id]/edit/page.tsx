import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";
import EditCategoryForm from "./EditCategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getAllSettings();
  const category = await prisma.category.findUnique({ where: { id: parseInt(params.id, 10) } });
  if (!category) notFound();

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle="Edit Category">
      <EditCategoryForm category={{ id: category.id, name: category.name, description: category.description }} />
    </AdminShell>
  );
}
