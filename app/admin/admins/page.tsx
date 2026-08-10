import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";
import { toggleAdminActive } from "@/lib/actions/admin-management-actions";
import AdminAddForm from "./AdminAddForm";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "SUPER_ADMIN") {
    return (
      <AdminShell siteName="GodGiftShop" adminName={session.name} role={session.role} pageTitle="Admin Accounts">
        <p className="text-red-600">Access denied. Super admin only.</p>
      </AdminShell>
    );
  }

  const settings = await getAllSettings();
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle="Admin Accounts">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3 font-medium">{a.fullName}</td>
                  <td>{a.email}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">{a.role}</span>
                  </td>
                  <td>{a.isActive ? <span className="text-green-600">Active</span> : <span className="text-red-600">Disabled</span>}</td>
                  <td>
                    {a.id !== session.id ? (
                      <ToggleButton adminId={a.id} isActive={a.isActive} />
                    ) : (
                      <span className="text-gray-400">(you)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Add Admin / Staff</h2>
          <AdminAddForm />
        </div>
      </div>
    </AdminShell>
  );
}

function ToggleButton({ adminId, isActive }: { adminId: number; isActive: boolean }) {
  async function handleToggle() {
    "use server";
    await toggleAdminActive(adminId);
  }
  return (
    <form action={handleToggle}>
      <button type="submit" className="text-blue-600 hover:underline">
        {isActive ? "Disable" : "Enable"}
      </button>
    </form>
  );
}
