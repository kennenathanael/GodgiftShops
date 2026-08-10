"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/utils";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

async function uploadImageIfProvided(formData: FormData): Promise<string | undefined> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return undefined;
  const blob = await put(`products/${Date.now()}-${file.name}`, file, {
    access: "public",
  });
  return blob.url;
}

export async function createProduct(_prevState: { error: string } | undefined , formData: FormData) {
  const admin = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const categoryId = parseInt(String(formData.get("category_id") || "0"), 10);
  const price = parseFloat(String(formData.get("price") || "0"));
  const stockQuantity = parseInt(String(formData.get("stock_quantity") || "0"), 10);
  const description = String(formData.get("description") || "").trim();
  const isFeatured = formData.get("is_featured") === "on";
  const newOverride = String(formData.get("new_override") || "AUTO") as "AUTO" | "YES" | "NO";

  if (!name || !categoryId || price <= 0) {
    return { error: "Please fill in name, category, and a valid price." };
  }

  const imageUrl = await uploadImageIfProvided(formData);
  const slug = `${makeSlug(name)}-${Date.now()}`;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      categoryId,
      price,
      stockQuantity,
      description,
      isFeatured,
      newOverride,
      image: imageUrl,
      createdById: admin.id,
    },
  });

  await prisma.activityLog.create({
    data: { adminId: admin.id, action: `Added product: ${name}`, targetType: "product", targetId: product.id },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(productId: number, _prevState: { error: string } | undefined , formData: FormData) {
  const admin = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const categoryId = parseInt(String(formData.get("category_id") || "0"), 10);
  const price = parseFloat(String(formData.get("price") || "0"));
  const stockQuantity = parseInt(String(formData.get("stock_quantity") || "0"), 10);
  const description = String(formData.get("description") || "").trim();
  const isFeatured = formData.get("is_featured") === "on";
  const newOverride = String(formData.get("new_override") || "AUTO") as "AUTO" | "YES" | "NO";

  if (!name || !categoryId || price <= 0) {
    return { error: "Please fill in name, category, and a valid price." };
  }

  const imageUrl = await uploadImageIfProvided(formData);

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      categoryId,
      price,
      stockQuantity,
      description,
      isFeatured,
      newOverride,
      ...(imageUrl ? { image: imageUrl } : {}),
    },
  });

  await prisma.activityLog.create({
    data: { adminId: admin.id, action: `Edited product: ${name}`, targetType: "product", targetId: productId },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(productId: number) {
  const admin = await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (product) {
    await prisma.product.delete({ where: { id: productId } });
    await prisma.activityLog.create({
      data: { adminId: admin.id, action: `Deleted product: ${product.name}`, targetType: "product", targetId: productId },
    });
  }
  revalidatePath("/admin/products");
}
