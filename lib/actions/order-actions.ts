"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

const VALID_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export async function updateOrderStatus(orderId: number, formData: FormData) {
  const admin = await requireAdmin();
  const status = String(formData.get("status") || "");

  if (!VALID_STATUSES.includes(status as any)) return { error: "Invalid status." };

  await prisma.order.update({ where: { id: orderId }, data: { status: status as any } });
  await prisma.activityLog.create({
    data: { adminId: admin.id, action: `Updated order #${orderId} status to ${status}`, targetType: "order", targetId: orderId },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}
