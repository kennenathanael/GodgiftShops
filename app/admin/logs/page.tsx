import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings } from "@/lib/utils";
import AdminShell from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getAllSettings();
  const logs = await prisma.activityLog.findMany({
    include: { admin: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <AdminShell siteName={settings.site_name || "GodGiftShop"} adminName={session.name} role={session.role} pageTitle="Activity Logs">
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Admin</th>
              <th>Action</th>
              <th>Target</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3 font-medium">{log.admin?.fullName || "Unknown"}</td>
                <td>{log.action}</td>
                <td>
                  {log.targetType} {log.targetId ? `#${log.targetId}` : ""}
                </td>
                <td>{log.createdAt.toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
