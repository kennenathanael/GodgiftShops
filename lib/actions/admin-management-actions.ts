"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "SUPER_ADMIN") throw new Error("Access denied. Super admin only.");
  return session;
}

export async function createAdminAccount(_prevState: { error: string }| undefined, formData: FormData) {
  const admin = await requireSuperAdmin();

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "STAFF") as "SUPER_ADMIN" | "STAFF";

  if (!fullName || !email || !password) return { error: "Please fill in all fields." };

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return { error: "An admin with this email already exists." };

  const hash = await bcrypt.hash(password, 10);
  const newAdmin = await prisma.admin.create({ data: { fullName, email, password: hash, role } });

  await prisma.activityLog.create({
    data: { adminId: admin.id, action: `Added admin account: ${email} (${role})`, targetType: "admin", targetId: newAdmin.id },
  });

  revalidatePath("/admin/admins");
}

export async function toggleAdminActive(targetId: number) {
  const admin = await requireSuperAdmin();
  if (targetId === admin.id) return { error: "You cannot disable your own account." };

  const target = await prisma.admin.findUnique({ where: { id: targetId } });
  if (!target) return { error: "Admin not found." };

  await prisma.admin.update({ where: { id: targetId }, data: { isActive: !target.isActive } });
  await prisma.activityLog.create({
    data: { adminId: admin.id, action: `Toggled active status for admin #${targetId}`, targetType: "admin", targetId },
  });

  revalidatePath("/admin/admins");
}
