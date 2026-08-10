import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings, formatPrice } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getAllSettings();

  const [totalProducts, soldOutCount, lowStock, ordersToday, pendingOrders, revenueAgg, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stockQuantity: { lte: 0 } } }),
    prisma.product.count({ where: { stockQuantity: { gt: 0, lte: 5 } } }),
    prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const totalRevenue = revenueAgg._sum.totalAmount?.toString() || "0";

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle="Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Products" value={totalProducts} />
        <Stat label="Sold Out" value={soldOutCount} color="text-red-600" />
        <Stat label="Low Stock (≤5)" value={lowStock} color="text-yellow-600" />
        <Stat label="Orders Today" value={ordersToday} />
        <Stat label="Pending Orders" value={pendingOrders} color="text-orange-600" />
        <div className="bg-white rounded-xl shadow p-5 col-span-2">
          <p className="text-gray-500 text-sm">Total Revenue (non-cancelled)</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
        <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="py-2">
                  <Link href={`/admin/orders/${o.id}`} className="text-brand underline">
                    #{o.id}
                  </Link>
                </td>
                <td>{o.guestName}</td>
                <td>{formatPrice(o.totalAmount.toString())}</td>
                <td>
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">{o.status}</span>
                </td>
                <td>{o.createdAt.toLocaleString()}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-gray-500 py-4 text-center">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, color = "" }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
