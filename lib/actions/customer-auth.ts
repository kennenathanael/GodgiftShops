"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCustomerSession, clearCustomerSession } from "@/lib/auth";

export async function registerCustomer(_prevState: { error: string } | undefined, formData: FormData) {
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");

  if (!fullName || !email || !password) {
    return { error: "Please fill in all required fields." };
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hash = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: { fullName, email, phone, password: hash },
  });

  await createCustomerSession({ id: customer.id, fullName: customer.fullName });
  redirect("/");
}

export async function loginCustomer(_prevState: { error: string }| undefined , formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !(await bcrypt.compare(password, customer.password))) {
    return { error: "Invalid email or password." };
  }

  await createCustomerSession({ id: customer.id, fullName: customer.fullName });
  redirect("/");
}

export async function logoutCustomer() {
  clearCustomerSession();
  redirect("/");
}
