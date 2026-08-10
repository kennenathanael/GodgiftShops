"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdminSession, clearAdminSession } from "@/lib/auth";

export async function setupFirstAdmin(_prevState: { error: string } | undefined, formData: FormData) {
  const adminCount = await prisma.admin.count();
  if (adminCount > 0) {
    return { error: "Setup already completed. An admin account already exists." };
  }

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!fullName || !email || password.length < 6) {
    return { error: "Please fill all fields. Password must be at least 6 characters." };
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.admin.create({
    data: { fullName, email, password: hash, role: "SUPER_ADMIN" },
  });

  redirect("/admin/login?setup=done");
}

export async function loginAdmin(_prevState: { error: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.password))) {
    return { error: "Invalid credentials or account disabled." };
  }

  await createAdminSession({ id: admin.id, fullName: admin.fullName, role: admin.role });
  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  clearAdminSession();
  redirect("/admin/login");
}
