import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings, formatPrice } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";
import { updateOrderStatus } from "@/lib/actions/order-actions";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getAllSettings();
  const orderId = parseInt(params.id, 10);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  const handleUpdateStatus = updateOrderStatus.bind(null, orderId);

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle={`Order #${orderId}`}>
      <Link href="/admin/orders" className="text-sm text-gray-500 hover:underline">
        &larr; Back to Orders
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Order Items</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.productName}</td>
                  <td>{formatPrice(item.priceAtPurchase.toString())}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(Number(item.priceAtPurchase) * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold text-lg mt-4">Total: {formatPrice(order.totalAmount.toString())}</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Customer & Delivery</h2>
          <p className="text-sm mb-1">
            <strong>Name:</strong> {order.guestName}
          </p>
          <p className="text-sm mb-1">
            <strong>Phone:</strong> {order.guestPhone}
          </p>
          {order.guestEmail && (
            <p className="text-sm mb-1">
              <strong>Email:</strong> {order.guestEmail}
            </p>
          )}
          <p className="text-sm mb-4">
            <strong>Address:</strong> {order.deliveryAddress}
          </p>
          <p className="text-sm mb-4">
            <strong>Payment:</strong> Cash on Delivery
          </p>

          <form action={handleUpdateStatus}>
            <label className="block text-sm font-medium mb-1">Update Status</label>
            <select name="status" defaultValue={order.status} className="w-full border rounded-lg px-3 py-2 mb-3">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold">
              Save Status
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
