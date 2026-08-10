import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings, formatPrice } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";

export const dynamic = "force-dynamic";

const STATUSES = [
  { val: "", label: "All" },
  { val: "PENDING", label: "Pending" },
  { val: "CONFIRMED", label: "Confirmed" },
  { val: "SHIPPED", label: "Shipped" },
  { val: "DELIVERED", label: "Delivered" },
  { val: "CANCELLED", label: "Cancelled" },
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getAllSettings();
  const statusFilter = searchParams.status || "";

  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter as any } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle="Orders">
      <div className="flex gap-2 mb-4 text-sm overflow-x-auto">
        {STATUSES.map((s) => (
          <Link
            key={s.val}
            href={`/admin/orders?status=${s.val}`}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${statusFilter === s.val ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Order #</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-medium">#{o.id}</td>
                <td>{o.guestName}</td>
                <td>{o.guestPhone}</td>
                <td>{formatPrice(o.totalAmount.toString())}</td>
                <td>
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">{o.status}</span>
                </td>
                <td>{o.createdAt.toLocaleString()}</td>
                <td>
                  <Link href={`/admin/orders/${o.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
