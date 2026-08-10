"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function createCategory(_prevState: { error: string }, formData: FormData) {
  const admin = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name) return { error: "Category name is required." };

  const slug = makeSlug(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: "A category with this name already exists." };

  const category = await prisma.category.create({ data: { name, slug, description } });
  await prisma.activityLog.create({
    data: { adminId: admin.id, action: `Added category: ${name}`, targetType: "category", targetId: category.id },
  });

  revalidatePath("/admin/categories");
}

export async function updateCategory(categoryId: number, _prevState: { error: string }, formData: FormData) {
  const admin = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name) return { error: "Name is required." };

  await prisma.category.update({ where: { id: categoryId }, data: { name, description } });
  await prisma.activityLog.create({
    data: { adminId: admin.id, action: `Edited category: ${name}`, targetType: "category", targetId: categoryId },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(categoryId: number) {
  const admin = await requireAdmin();
  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    return { error: "Cannot delete: this category still has products. Move or delete them first." };
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  await prisma.category.delete({ where: { id: categoryId } });
  if (category) {
    await prisma.activityLog.create({
      data: { adminId: admin.id, action: `Deleted category: ${category.name}`, targetType: "category", targetId: categoryId },
    });
  }

  revalidatePath("/admin/categories");
}
